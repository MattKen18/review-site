import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addGenre, addToFireStore, convertShownReviews, getFromFireStore, getInitialUserFeed, getShownReviews, getUserFeed, updateUserFeed } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectAuthFiltering, selectFilters, selectGenreFiltering, selectMossFiltering } from '../../slices/filterSlice';
import Review from '../Review';
import { useDispatch } from 'react-redux';
import LoadingAnimation from 'react-loading';
import ReviewPlaceholder from '../ReviewPlaceholder';
import SidePane from '../SidePane';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import $ from 'jquery'
import Alert from '../Alert';

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
  const [loading, setLoading] = useState(true)
  // const [updatingFeed, setUpdating] = useState(false)
  
  useEffect(() => {
    getInitialUserFeed(numOfItemsToGet).then(feed => {
      // feed[0] is the actual feed
      // feed[1] is the ref of the last item in the feed 
      setUserFeed(feed[0])
      setLastItem(feed[1])
    })
  }, [])

  useEffect(() => {
    console.log(lastItem)
    if (userFeed.length) {
      document.addEventListener('scroll', handleFeedUpdate)
      return () => document.removeEventListener('scroll', handleFeedUpdate)
    }
  }, [userFeed, lastItem])

  const handleFeedUpdate = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // at the bottom of the page
      updateUserFeed(lastItem, numOfItemsToGet)
      .then(newFeed => {
        setUserFeed(prevFeed => [...prevFeed, ...newFeed[0]])
        setLastItem(newFeed[1])
      })
    }
  }

  // useEffect(() => {
  //   console.log(userFeed)
  // }, [userFeed])

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
              // !loading ?
              <div className='m-auto'>
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
                  {userFeed.map((review, i) => (
                    <Review key={review+i} review={review} />
                  )) 
                  }

                </div>
              }
              </div>
              // :
              // <div className='mt-20 m-auto'>
              //   <ReviewPlaceholder />
              //   <ReviewPlaceholder />
              //   <ReviewPlaceholder />
              //   <ReviewPlaceholder />
              //   <ReviewPlaceholder />
              // </div>
            }
          </div>
    
      </div>
    </>
  )
}

export default Home;