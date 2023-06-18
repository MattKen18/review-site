import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined'
import React, { useEffect, useRef, useState } from 'react'
import RatingStars from './RatingStars'
import ReviewImageCarousel from './ReviewImageCarousel'
import { Link } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { addHelpful, addReviewToUserSaved, addUnHelpful, convertReview, getReviewFromFirestore, getUserFromFirestore, getUserHelpfulsAndUnhelpfuls, removeHelpful, removeReviewFromUserSaved, removeReviewToUserSaved, removeUnHelpful } from '../firebase'
import { current } from '@reduxjs/toolkit'
import ReviewPlaceholder from './ReviewPlaceholder'



const Review = ({review, incSaves, decSaves}) => {//{review: {id, author, headline, body, genre: {title, color}, tag, images, timestamp, comments, rating}}) => {
  const [bookmarked, setBookmarked] = useState(false) //change to use selector to get list of bookmarked items of the user
  const [helpful, setHelpful] = useState(null) //true if the user selects 
  const [justClicked, setJustClicked] = useState(null)
  
  const [currentUser, setCurrentUser] = useState(null)
  const [currentAuthor, setCurrentAuthor] = useState(null) //corresponding user from firestore (of current user) with additional fields and foreign keys to review
  const [isSavedByUser, setIsSavedByUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const auth = getAuth()
  
  const [author, setAuthor] = useState(null)
  const [genre, setGenre] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      }
    })
  }, [])


  useEffect(() => {
    //already converted so no need to convert again
    if (review.hasOwnProperty('converted')) {
      setAuthor(review.author)
      setGenre(review.genre)
      setLoading(false)
    }else {
      //convert the author and genre from a reference to a usable object and update the state if the review is not already converted
      convertReview(review).then((convertedReview) => {
        // console.log("review: ", review)
        setAuthor(convertedReview.author)
        setGenre(convertedReview.genre)
        setLoading(false)
      })
    }
  }, [])


  //set the review as bookmarked if the user has it saved
  useEffect(() => {
    if (currentUser) {
      getUserFromFirestore(currentUser.uid).then(user => setCurrentAuthor(user))
    }
  }, [currentUser])

  useEffect(() => {
    if (currentAuthor) {
      if (currentAuthor?.saves.indexOf(review.id) !== -1) {// if the currently logged in user has this review in their saved
        setBookmarked(true)
      }
      if (!currentAuthor?.helpfulReviews) {
        setHelpful(null)
      } else if (currentAuthor?.helpfulReviews.indexOf(review.id) !== -1) {// if the currently logged in user has this review as helpful
        setHelpful(true)
      } else if (currentAuthor?.unhelpfulReviews.indexOf(review.id) !== -1) {
        setHelpful(false)
      } else {
        setHelpful(null)
      }

    }
  }, [currentAuthor])


  const toggleReviewSaved = () => {
    if (bookmarked) { //already saved
      try {
        decSaves()
      } catch {}
      setBookmarked(false)
      removeReviewFromUserSaved(review.id, currentUser?.uid)
    } else {
      try {
        incSaves()
      } catch {}
      setBookmarked(true)
      addReviewToUserSaved(review.id, currentUser?.uid)
    }
  }
  /* whenever user selects helpful or bookmarked add 
     to a list of helpful reviews/ bookmarks in the user table */

  const handleHelpfulClick = () => {
    if (helpful === null) {
      try {
        addHelpful(currentAuthor.uid, review.id)
        setHelpful(true)
      } catch (e) {
        console.log(e)
      }
    } else if (helpful === false) {
      try {
        removeUnHelpful(currentAuthor.uid, review.id)
        addHelpful(currentAuthor.uid, review.id)
        setHelpful(true)
      } catch (e) {
        console.log(e)
      }
    } else {
      removeHelpful(currentAuthor.uid, review.id)
      setHelpful(null)
    }
  } 

  const handleUnHelpfulClick = () => {
    if (helpful === null) {
      try {
        addUnHelpful(currentAuthor.uid, review.id)
        setHelpful(false)
      } catch (e) {
        console.log(e)
      }
    } else if (helpful) {
      try {
        removeHelpful(currentAuthor.uid, review.id)
        addUnHelpful(currentAuthor.uid, review.id)
        setHelpful(false)
      } catch (e) {
        console.log(e)
      }
    } else {
      removeUnHelpful(currentAuthor.uid, review.id)
      setHelpful(null)
    }
  }

  const timePassed = () => {
    const timeCreated = review?.timestamp.toDate()
    const currentTime = new Date()
    const timePassed = (currentTime.getTime()-timeCreated.getTime())/1000 //milliseconds passed from when the review was created to now

    const year = 31557600
    const month = 2629800
    const week = 604800
    const day = 86400
    const hour = 3600
    const minute = 60

    if (timePassed >= year) {
      const years = Math.floor(timePassed/year)
      return years > 1 ? `${years} years ago` : `${years} year ago`
    } else if (timePassed >= month) {
      const months = Math.floor(timePassed/month)
      return months > 1 ? `${months} months ago` : `${months} month ago`
    } else if (timePassed >= week) {
      const weeks = Math.floor(timePassed/week)
      return weeks > 1 ? `${weeks} weeks ago` : `${weeks} week ago`
    } else if (timePassed >= day) {
      const days = Math.floor(timePassed/day)
      return days > 1 ? `${days} days ago` : `${days} day ago`
    } else if (timePassed >= hour) {
      const hours = Math.floor(timePassed/hour)
      return hours > 1 ? `${hours} hours ago` : `${hours} hour ago`
    } else if (timePassed >= minute) {
      const minutes = Math.floor(timePassed/minute)
      return minutes > 1 ? `${minutes} mins ago` : `${minutes} min ago`
    } else {
      const seconds = Math.floor(timePassed)
      return seconds > 1 ? `${seconds} seconds ago` : seconds <= 0 ?  `1 second ago` : `${seconds} second ago`
      // return Math.floor(timePassed) + ' seconds ago'//"< 1min ago"
    }
  }

  useEffect(() => {
    // update database if helpful changes, ie remove or add to user's helpful list 
    // or maybe add to review itself instead of user (or add to both) so i can have how many people
    // think its helpful/not helpful
    try {
      document.getElementById(`${review.id}-review-detail-click`).style.backgroundColor = genre?.color
    } catch {

    }
  }, [genre])



  const reviewHeading = review?.tag ? 
    <p className='text-sm font-light'>{review?.tag}<span className='opacity-70 font-extralight'> • {genre?.title}</span></p> :
    <p className='text-sm font-light'><span className='opacity-70 font-extralight'>{genre?.title}</span></p>

  return (
      <>
        {
          !loading ? 
          <>
            {!review?.images.length > 0 ? 
              <>
                {/* review with no image  */}
                <div id={`${review?.id}-review`} className={`relative z-0 flex flex-col min-h-[200px] h-fit bg-white rounded-md shadow-sm mb-10 p-6 overflow-hidden`}>
                  <div id={`${review?.id}-review-detail-click`} className={`group absolute -top-20 -right-20 w-36 h-28 z-1 rotate-45 duration-300 hover:scale-150 hover:cursor-pointer`}>
                    <Link to={`/review/${review?.id}`} className='relative w-full h-full block'>
                      <RedoOutlinedIcon className='absolute bottom-20 left-[45%] w-20 text-white z-10 -rotate-90 transform group-hover:translate-y-20'/>
                    </Link>
                  </div> 
                  <div className='mb-5'>
                    {
                      reviewHeading
                    }
                    <div className='flex space-x-8 items-center'>
                      <h1 className='font-extrabold text-2xl line-clamp-2'><a href={`/review/${review.id}`} className=''>{review?.headline}</a></h1>
                      <div className='flex'><RatingStars rating={review?.rating} /><span className='font-light'>{review?.rating}/5</span></div>
                      
                    </div>
                  </div>
                  <div className='relative flex-1 mb-5'>
                    <div>
                      <p className='font-display h-full line-clamp-6 bg-white mb-2'>{review?.body}</p>
                    </div>
                  </div>
                  <div className='relative flex'>
                    <div className='flex items-center space-x-3 text-sm'>
                      <p className=''><span className='p-1 border-2 border-slate-200 rounded-md bg-slate-200 text-xs mr-2 opacity-80'>{timePassed()}</span> By <Link to={`/user/${author?.uid}/profile`} className='font-body underline underline-offset-4 hover:cursor-pointer hover:bg-cyan-100'>{author?.userName || "Anonymous"}</Link></p>
                      <a href={`/review/${review.id}`} className='flex items-center space-x-1 hover:cursor-pointer hover:opacity-1 hover:text-primary'><ChatBubbleLeftEllipsisIcon className='w-6' /><span className=''>{review?.comments.length > 0 && review?.comments.length}</span></a>
                      {
                        !currentUser?.isAnonymous && currentUser ?
                        !bookmarked ?
                          <BookmarkBorderOutlinedIcon className='hover:cursor-pointer hover:text-primary' onClick={() => toggleReviewSaved()} /> :
                          <BookmarkOutlinedIcon className='hover:cursor-pointer text-primary hover:text-primary' onClick={() => toggleReviewSaved()} />
                        :
                        <BookmarkBorderOutlinedIcon className='hover:cursor-not-allowed hover:opacity-60' />
                      }
                    </div>
                    {/* absolute flex flex-col top-1/2 -right-10 -translate-x-1/2 -translate-y-1/2 */}
                    <div className='flex-1 space-x-1 items-center'>
                      <div className='relative float-right flex space-x-1 items-center'>
                        {/* <p className='absolute text-xs w-24 -right-1/3 -top-4 hidden peer-hover:block'>Was this helpful?</p> */}
                          {
                            currentUser?.uid !== author?.uid &&
                            <div className='group flex items-center justify-center space-x-1'>
                              <p className='text-xs hidden group-hover:block mr-2 opacity-70'>Was this helpful?</p> 
                              {
                                  !currentUser?.isAnonymous && currentUser ?
                                  <>
                                    <ThumbUpOutlinedIcon id={`thumbs-up-${review.id}`} className={`peer w-6 hover:cursor-pointer hover:scale-110 ${helpful === true && `text-primary`}`} onClick={() => handleHelpfulClick()} />
                                    <ThumbDownOutlinedIcon id={`thumbs-down-${review.id}`} className={`peer w-6 hover:cursor-pointer hover:scale-110 ${helpful === false && `text-primary`}`} onClick={() => handleUnHelpfulClick()} />
                                  </>
                                  :
                                  <>
                                    <ThumbUpOutlinedIcon id={`thumbs-up-${review.id}`} className={`peer w-6 hover:cursor-not-allowed hover:scale-110 ${helpful === true && `text-primary`}`} />
                                    <ThumbDownOutlinedIcon id={`thumbs-down-${review.id}`} className={`peer w-6 hover:cursor-not-allowed hover:scale-110 ${helpful === false && `text-primary`}`} />
                                  </> 
                                }
                            </div>                
                          }
                        
                      </div>
                    </div>
                  </div>

                </div>
              </> 
              :
              <>
                {/* review with image */}
                <div className={`relative z-0 flex min-h-[300px] h-fit bg-white rounded-md shadow-sm mb-10 p-6 overflow-hidden`}>
                  {/* image section */}
                  <div className='flex items-center justify-center pr-10'>
                    <ReviewImageCarousel imgSources={review?.images} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div id={`${review.id}-review-detail-click`} className={`group absolute -top-20 -right-20 w-36 h-28 z-1 rotate-45 duration-300 hover:scale-150 hover:cursor-pointer`}>
                      <Link to={`/review/${review.id}`} className='relative w-full h-full block'>
                        <RedoOutlinedIcon className='absolute bottom-20 left-[45%] w-20 text-white z-10 -rotate-90 transform group-hover:translate-y-20'/>
                      </Link>
                    </div> 
                    <div className='mb-5'>
                      {
                        reviewHeading
                      }
                      <div className='flex space-x-8 items-center'>
                      <h1 className='font-extrabold text-2xl line-clamp-2'><a href={`/review/${review.id}`} className=''>{review?.headline}</a></h1>
                        <div className='flex'><RatingStars rating={review?.rating} /><span className='font-light'>{review?.rating}/5</span></div>
                        
                      </div>
                    </div>
                    <div className='relative flex-1 mb-5'>
                      <div>
                        <p className='h-full font-display line-clamp-6 bg-white mb-2'>{review?.body}</p>
                      </div>
                    </div>
                    <div className='relative flex'>
                      <div className='flex items-center space-x-3 text-sm'>
                      <p className=''><span className='p-1 border-2 border-slate-200 rounded-md bg-slate-200 text-xs mr-2 opacity-80'>{timePassed()}</span> By <Link to={`/user/${author?.uid}/profile`} className='font-body underline underline-offset-4 hover:cursor-pointer hover:bg-cyan-100'>{author?.userName || "Anonymous"}</Link></p>
                        <a href={`/review/${review.id}`} className='flex items-center space-x-1 hover:cursor-pointer hover:opacity-1 hover:text-primary'><ChatBubbleLeftEllipsisIcon className='w-6' /><span className=''>{review?.comments.length > 0 && review?.comments.length}</span></a>
                        {
                        !currentUser?.isAnonymous && currentUser ?
                        !bookmarked ?
                          <BookmarkBorderOutlinedIcon className='hover:cursor-pointer hover:text-primary' onClick={() => toggleReviewSaved()} /> :
                          <BookmarkOutlinedIcon className='hover:cursor-pointer text-primary hover:text-primary' onClick={() => toggleReviewSaved()} />
                        :
                        <BookmarkBorderOutlinedIcon className='hover:cursor-not-allowed hover:opacity-60' />
                      }
                      </div>
                      {/* absolute flex flex-col top-1/2 -right-10 -translate-x-1/2 -translate-y-1/2 */}
                      <div className='flex-1 space-x-1 items-center'>
                        <div className='relative float-right flex space-x-1 items-center'>
                          {/* <p className='absolute text-xs w-24 -right-1/3 -top-4'>Was this helpful?</p> */}
                            {
                              currentUser?.uid !== author?.uid &&
                              <div className='group flex items-center justify-center space-x-1'>
                                <p className='text-xs hidden group-hover:block mr-2 opacity-70'>Was this helpful?</p> 
                                {
                                  !currentUser?.isAnonymous && currentUser ?
                                  <>
                                    <ThumbUpOutlinedIcon id={`thumbs-up-${review.id}`} className={`peer w-6 hover:cursor-pointer hover:scale-110 ${helpful === true && `text-primary`}`} onClick={() => handleHelpfulClick()} />
                                    <ThumbDownOutlinedIcon id={`thumbs-down-${review.id}`} className={`peer w-6 hover:cursor-pointer hover:scale-110 ${helpful === false && `text-primary`}`} onClick={() => handleUnHelpfulClick()} />
                                  </>
                                  :
                                  <>
                                    <ThumbUpOutlinedIcon id={`thumbs-up-${review.id}`} className={`peer w-6 hover:cursor-not-allowed hover:scale-110 ${helpful === true && `text-primary`}`} />
                                    <ThumbDownOutlinedIcon id={`thumbs-down-${review.id}`} className={`peer w-6 hover:cursor-not-allowed hover:scale-110 ${helpful === false && `text-primary`}`} />
                                  </> 
                                }
                              </div>               
                            }
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          </>
          :
          <ReviewPlaceholder />
        }

      </>

    )
}

export default Review