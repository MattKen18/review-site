import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addGenre, addToFireStore, convertShownReviews, getFromFireStore, getShownReviews, getUserFeed } from '../../firebase';
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

  const [userFeed, setUserFeed] = useState([])

  const [loading, setLoading] = useState(true)


  // useEffect(() => {
  //   getShownReviews().then(data => { 
  //     convertShownReviews(data).then(data => {
  //       setUserFeed(data)
  //       setLoading(false)
  //     })
  //   })
  // }, [])

  useEffect(() => {
    getUserFeed(100).then(feed => {
      // console.log(feed)
      setUserFeed(feed)
      setLoading(false)
    })
  }, [])
  
  

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