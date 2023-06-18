import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { convertReview, getReviewFromFirestore } from '../../firebase'
import AdSpace from '../AdSpace'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import RatingStars from '../RatingStars';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import $ from 'jquery'
import CommentSection from '../CommentSection';

const DetailView = () => {
  const [review, setReview] = useState(null)
  const { id } = useParams()
  const [currentUser, setCurrentUser] = useState(null)
  const [userCanEdit, setUserCanEdit] = useState(false)
  const auth = getAuth();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getReviewFromFirestore(id).then((review) => {
      convertReview(review).then(convertedReview => {
        setReview(convertedReview)
      })
    })
  }, [])

  useEffect(() => {
    console.log(review)
  }, [review])

  useEffect(() => {
    document.getElementById('review-genre').style.backgroundColor = review?.genre.color
  }, [review])


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
  }, [])

  useEffect(() => {
    // console.log("current user: ", currentUser?.uid, "author: ", review?.author.uid)
    setUserCanEdit(currentUser?.uid === review?.author?.uid)
  }, [currentUser, review])

  const showImages = () => {
    const showHide = document.getElementById('show-hide')
    $('#images-container').slideToggle()
    if (showHide.innerHTML === '+') {
      showHide.innerHTML = "-"
      showHide.style.color = '#f43f5e'
    } else {
      showHide.innerHTML = "+"
      showHide.style.color = '#3b82f6'
    }
  }

  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div className='flex-1 px-20 bg-gray-100 pb-20'>
        <div className='min-h-10 h-10 mb-3'></div>
        <div className='flex flex-col relative p-8 rounded-md bg-white'>
          {
            userCanEdit && 
            <span className='absolute right-2 top-2 duration-100 p-1 hover:text-primary hover:cursor-pointer opacity-60 hover:opacity-100'>
              <Link to={`/review/${id}/edit`}><BorderColorOutlinedIcon className='' /></Link>
            </span>
          }
          <h1 className='text-2xl font-bold'>{review?.headline}</h1>
          <div className='flex space-x-4'>
            <p className='font-light'><LocalOfferOutlinedIcon className='text-primary' fontSize='extra-small'/> {review?.tag}</p>
            <span className='flex'><RatingStars rating={review?.rating}/> {review?.rating}/5</span>
          </div>
          <br />
          <p className='text-sm font-bold'>
            By 
            <span className='underline underline-offset-4 hover:cursor-pointer hover:bg-cyan-100 mr-2 ml-2'>{review?.author?.userName || "Anonymous"}</span>
            in
            <span id='review-genre' className='p-2 rounded-lg text-white font-normal ml-2 transform hover:cursor-pointer hover:scale-110 duration-100'>{review?.genre.title}</span>

          </p>
          <div className='mt-16'>
            <p className='rounded-lg font-body before:first-letter:font-bold'>
              {review?.body}
            </p>
          </div>
          <div className='mt-5'>
            {
              review?.images.length > 0 &&
              <button id='images-toggle' onClick={() => showImages()} className='group text-sm font-bold p-4'>
                <span id='show-hide' className='text-blue-500'>+</span> Images
              </button>
            }
          </div>
          <div id="images-container" className='hidden'>
            <div className='flex space-x-8 mt-10 justify-start w-full rounded-md p-4'>
              {
                review?.images.map((image, i) => (
                  <div key={i} className='flex items-center justify-center w-[250px] h-[300px] overflow-hidden bg-slate-100 rounded-md'>
                    <img src={image} alt="review image" className='object-cover w-full' />
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className='mt-2'>
          <CommentSection review={review} />
        </div>
      </div>
    </div>
  )
}

export default DetailView