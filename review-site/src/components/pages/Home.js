import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addGenre, addToFireStore, convertShownReviews, getFromFireStore, getInitialUserFeed, getShownReviews, getUserFeed, updateUserFeed } from '../../firebase';
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
      if (!lastItem) {
        setEndOfResults(true)
      }
      document.addEventListener('scroll', handleFeedUpdate)
      return () => document.removeEventListener('scroll', handleFeedUpdate)
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
      updateUserFeed(lastItem, numOfItemsToGet)
      .then(newFeed => {
        setUserFeed(prevFeed => [...prevFeed, ...newFeed[0]])
        setLastItem(newFeed[1])
      }) 
    }
  }, [updatingFeed])



  useEffect(() => {
    if (updatingFeed) {
      console.log("updating Feed")
      setUpdatingFeed(false)
    }
  }, [userFeed])

  useEffect(() => {
    console.log(userFeed)
  }, [userFeed])

  return (
    <>
      <div className='flex'>
          <aside className='h-screen basis-1/5'>
            <SidePane />
          </aside>
          <div className='flex-1 bg-gray-100'>
            <div className='w-11/12 m-auto my-16'>
              <h1 className='text-3xl font-bold text-center mb-3'>Your Feed</h1>
              {/* <hr /> */}
            </div>
            {
              <div className='m-auto'>
                {
                  !initialLoading ?
                  <>
                    {
                      genreFiltering || mossFiltering || authFiltering ? 
                      <>
                        <h2 className='text-center'>Filtering...</h2>
                        <ul>
                          {filters.map((filter, i) => (
                            <li key={i} className='block text-center'>{filter}</li>
                          ))}
                        </ul>
                      </>
                      : 
                      <div className='w-11/12 m-auto'>
                        <>
                          {
                            userFeed.map((review, i) => (
                              <Review key={review+i} review={review} />
                            )) 
                          }
                          {
                            endOfResults ?
                              <div><h1 className='text-center font-bold text-sm my-4 text-primary'>You've reached the end :)</h1></div>
                            :
                            updatingFeed &&
                            <Loader params={{
                              // content: 'Loading more content',
                              type: 'bars',
                              color: '#3F51B5',
                              height: '40px',
                              width: '40px',
                            }} />
                          }
                        </>

                      </div>
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
                    {/* <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder />
                    <ReviewPlaceholder /> */}
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