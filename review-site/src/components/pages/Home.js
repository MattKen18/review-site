import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addGenre, addToFireStore, convertShownReviews, getFilteredUserFeed, getFromFireStore, getInitialUserFeed, getShownReviews, getUserFeed, updateFilteredUserFeed, updateUserFeed } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectAuthFiltering, selectFilters, selectGenreFiltering, selectMossFiltering } from '../../slices/filterSlice';
import Review from '../Review';
import { useDispatch } from 'react-redux';
import ReviewPlaceholder from '../ReviewPlaceholder';
import SidePane from '../SidePane';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import $ from 'jquery'
import Alert from '../Alert';
import Loader from '../Loader';
import InformCard from '../InformCard';
import InfiniteScrollContent from '../InfiniteScrollContent';

const Home = () => {
  const auth = getAuth()

  const createdUser = useRef(false)
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const genreFiltering = useSelector(selectGenreFiltering)
  const mossFiltering = useSelector(selectMossFiltering)
  const authFiltering = useSelector(selectAuthFiltering)

  const [numOfItemsToGet, setNumOfItemsToGet] = useState(10)
  const [userFeed, setUserFeed] = useState([])
  const [lastItem, setLastItem] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [updatingFeed, setUpdatingFeed] = useState(false)
  const [endOfResults, setEndOfResults] = useState(false)
  const [noResults, setNoResults] = useState(false)
  

  useEffect(() => {
    setTimeout(() => {
      getInitialUserFeed(numOfItemsToGet).then(feed => {
        // feed[0] is the actual feed
        // feed[1] is the ref of the last item in the feed 
        setInitialLoading(false)
        setUserFeed(feed[0])
        setLastItem(feed[1])
      })
      
    }, 0);

  }, [])

  useEffect(() => {
    if (userFeed.length) {
      setNoResults(false)
      if (!lastItem) {
        setEndOfResults(true)
      }
      document.addEventListener('scroll', handleFeedUpdate)
      return () => document.removeEventListener('scroll', handleFeedUpdate)
    } else { // if there are no results from filter
      setNoResults(true)
      setEndOfResults(false)
    } 
  }, [userFeed, lastItem])


  // handles getting new content on page scroll
  const handleFeedUpdate = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      setUpdatingFeed(true)
    }
  }

  useEffect(() => {
    if (updatingFeed) {
      if (genreFiltering || mossFiltering || authFiltering) {
        updateFilteredUserFeed(lastItem, numOfItemsToGet, filters)
        .then(newFeed => {
          setUserFeed(prevFeed => [...prevFeed, ...newFeed[0]])
          setLastItem(newFeed[1])
        })
      } else {
        updateUserFeed(lastItem, numOfItemsToGet)
        .then(newFeed => {
          setUserFeed(prevFeed => [...prevFeed, ...newFeed[0]])
          setLastItem(newFeed[1])
        }) 
      }
    }
  }, [updatingFeed, genreFiltering, mossFiltering, authFiltering, filters])




  useEffect(() => {
    if (updatingFeed) {
      console.log("updating Feed")
      setUpdatingFeed(false)
    }
  }, [userFeed])


  useEffect(() => {
    if (genreFiltering || mossFiltering || authFiltering) { //if a filter is active
      getFilteredUserFeed(numOfItemsToGet, filters).then(filteredReviews => {
        setUserFeed(filteredReviews[0])
        setLastItem(filteredReviews[1])
      })
    } else {
      getInitialUserFeed(numOfItemsToGet).then(feed => {
        // feed[0] is the actual feed
        // feed[1] is the ref of the last item in the feed 
        setUserFeed(feed[0])
        setLastItem(feed[1])
      })
    }
  }, [genreFiltering, mossFiltering, authFiltering, filters])


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filters])

  return (
    <>
      <div className='flex'>
          <aside className='h-screen basis-1/5'>
            <SidePane />
          </aside>
          <div className='flex-1 bg-gray-100'>
            <div className='w-11/12 m-auto my-16'>
              <h1 className='text-3xl font-bold text-center mb-3'>Your Feed</h1>
            </div>
            {
              <div className='m-auto'>
                {
                  !initialLoading ?
                  <>
                    {
                      <InfiniteScrollContent params={{
                        content: userFeed,
                        type: 'reviews',
                        endOfResults: endOfResults,
                        updatingFeed: updatingFeed,
                        noResults: noResults,
                      }}/>
                      // <div className='w-11/12 m-auto'>
                      //   <>
                      //     {
                      //       userFeed.map((review, i) => (
                      //         <Review key={review.id+i} review={review} />
                      //       )) 
                      //     }
                      //     {
                      //       endOfResults ?
                      //         <InformCard params={{                                
                      //           content: "No more results",
                      //           type: "alert",
                      //           emoji: "🫠",
                      //         }}
                      //         />
                      //       :
                      //       updatingFeed ?
                      //       <Loader params={{
                      //         // content: 'Loading more content',
                      //         type: 'bars',
                      //         color: '#3F51B5',
                      //         height: '40px',
                      //         width: '40px',
                      //       }} />
                      //       :
                      //       noResults &&
                      //         <InformCard params={{                                
                      //           content: "No results match filter",
                      //           subContent: "Please update filter and try again",
                      //           type: "alert",
                      //           emoji: '🥺',
                      //         }}
                      //       />
                      //     }
                      //   </>

                      // </div>
                    }
                  </>
                  :
                  <div className='w-11/12 m-auto mt-20'>
                    <Loader params={{
                      content: ['Generating feed', 'Just a minute', 'Almost there...'],
                      type: 'bars',
                      color: '#3F51B5',
                      height: '30px',
                      width: '30px',
                    }} />
                  </div>
                }
              </div>
            }
          </div>
    
      </div>
    </>
  )
}

export default Home;