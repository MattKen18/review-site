import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined'
import React, { useEffect, useRef, useState } from 'react'
import RatingStars from './RatingStars'
import ReviewImageCarousel from './ReviewImageCarousel'

const Review = ({id, review: {author, headline, body, genre: {title, color, border}, tag, images, timestamp, numOfComments, rating}}) => {
  const [bookmarked, setBookmarked] = useState(false) //change to use selector to get list of bookmarked items of the user
  const [helpful, setHelpful] = useState(false) //true if the user selects 
  const [justClicked, setJustClicked] = useState(null)
  const genreColor = `${color}`

  /* whenever user selects helpful or bookmarked add 
     to a list of helpful reviews/ bookmarks in the user table */

  const handleHelpfulClick = (id) => {
    // update state with justClicked 
    const elemClicked = document.getElementById(id)
    if (!justClicked) {// if first time clicking helpful
      setJustClicked(elemClicked)
      setHelpful(true) // user chose a helpful option helpful/not helpful
    } else if (elemClicked === justClicked) {
      // REMOVE FROM DB
      setJustClicked(null)
      setHelpful(false) // user deselected a helpful option helpful/not helpful
    } else if (id !== justClicked.id) {
      // remove previous clicked from db add new
      const prevClickedElem = justClicked
      setJustClicked(elemClicked)
    }

  } 

  const timePassed = () => {
    const timeCreated = timestamp.toDate()
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
      return "< 1min ago"
    }
  }

  useEffect(() => {
    // update database if helpful changes, ie remove or add to user's helpful list 
    // or maybe add to review itself instead of user (or add to both) so i can have how many people
    // think its helpful/not helpful
  }, [])

  return (
      <>
        {!images.length > 0 ? 
          <>
            <div className={`relative z-0 flex flex-col min-h-[300px] h-fit bg-white w-11/12 m-auto rounded-md shadow-sm mb-10 p-10 overflow-hidden`}>
              <div className={`group absolute -top-20 -right-20 w-36 h-28 z-1 ${genreColor} rotate-45 duration-300 hover:scale-150 hover:cursor-pointer`}>
                <a href='/' className='relative w-full h-full block'>
                  <RedoOutlinedIcon className='absolute bottom-20 left-[45%] w-20 text-white z-10 -rotate-90 transform group-hover:translate-y-20'/>
                </a>
              </div> 
              <div className='mb-5'>
                <p className='text-sm font-light'>{`'${tag}'`} <span className='opacity-70 font-extralight'>• {title}</span></p>
                <div className='flex space-x-8 items-center'>
                  <h1 className='font-extrabold text-2xl'>{headline}</h1>
                  <div className='flex'><RatingStars rating={rating} /><span className='font-light'>{rating}/5</span></div>
                  
                </div>
              </div>
              <div className='relative flex-1 mb-5'>
                <div>
                  <p className='h-full line-clamp-6 bg-white mb-2'>{body}</p>

                </div>
              </div>
              <div className='relative flex'>
                <div className='flex items-center space-x-8 text-sm'>
                  <p className='opacity-80'><span className='p-1 border-2 border-slate-200 rounded-md bg-slate-200 opacity-60 text-xs mr-2'>{timePassed()}</span> By {author}</p>
                  <p className='flex items-center space-x-2 hover:cursor-pointer hover:opacity-1 hover:text-papaya'><ChatBubbleLeftEllipsisIcon className='w-6' /> {numOfComments}</p>
                  { !bookmarked ?
                    <BookmarkBorderOutlinedIcon className='hover:cursor-pointer' onClick={() => setBookmarked(state => (!state))} /> :
                    <BookmarkOutlinedIcon className='hover:cursor-pointer text-papaya' onClick={() => setBookmarked(state => (!state))} />
                  }
                </div>
                {/* absolute flex flex-col top-1/2 -right-10 -translate-x-1/2 -translate-y-1/2 */}
                <div className='flex-1 space-x-1 items-center opacity-80 hover:opacity-100'>
                  <div className='relative float-right flex space-x-1 items-center'>
                    <p className='absolute text-xs w-24 -right-1/3 -top-4'>Was this helpful?</p>
                      {
                        <>
                          <ThumbUpOutlinedIcon id={`thumbs-up-${id}`} className={`w-6 hover:cursor-pointer hover:scale-110 ${helpful ? `text-papaya` : `text-black`}}`} onClick={() => handleHelpfulClick(`thumbs-up-${id}`)} />
                          <ThumbDownOutlinedIcon id={`thumbs-down-${id}`} className={`w-6 hover:cursor-pointer hover:scale-110 ${helpful ? `text-papaya` : `text-black`}}`} onClick={() => handleHelpfulClick(`thumbs-down-${id}`)} />
                        </>                
                      }
                    
                  </div>
                </div>
              </div>

            </div>
          </> 
          :
          <>
            <div className={`relative z-0 flex min-h-[300px] h-fit bg-white w-11/12 m-auto rounded-md shadow-sm mb-10 p-10 overflow-hidden`}>
              {/* image section */}
              <div className='flex items-center justify-center pr-10'>
                <ReviewImageCarousel imgSources={images} />
              </div>
              <div className='flex-1 flex flex-col'>
                <div className={`group absolute -top-20 -right-20 w-36 h-28 z-1 ${genreColor} rotate-45 duration-300 hover:scale-150 hover:cursor-pointer`}>
                  <a href='/' className='relative w-full h-full block'>
                    <RedoOutlinedIcon className='absolute bottom-20 left-[45%] w-20 text-white z-10 -rotate-90 transform group-hover:translate-y-20'/>
                  </a>
                </div> 
                <div className='mb-5'>
                  <p className='text-sm font-light'>{`'${tag}'`} <span className='opacity-70 font-extralight'>• {title}</span></p>
                  <div className='flex space-x-8 items-center'>
                    <h1 className='font-extrabold text-2xl'>{headline}</h1>
                    <div className='flex'><RatingStars rating={rating} /><span className='font-light'>{rating}/5</span></div>
                    
                  </div>
                </div>
                <div className='relative flex-1 mb-5'>
                  <div>
                    <p className='h-full line-clamp-6 bg-white mb-2'>{body}</p>
                  </div>
                </div>
                <div className='relative flex'>
                  <div className='flex items-center space-x-8 text-sm'>
                    <p className='opacity-80'><span className='p-1 border-2 border-slate-200 rounded-md bg-slate-200 opacity-60'>{timePassed()}</span> By {author}</p>
                    <p className='flex items-center space-x-2 hover:cursor-pointer hover:opacity-1 hover:text-papaya'><ChatBubbleLeftEllipsisIcon className='w-6' /> {numOfComments}</p>
                    { !bookmarked ?
                      <BookmarkBorderOutlinedIcon className='hover:cursor-pointer' onClick={() => setBookmarked(state => (!state))} /> :
                      <BookmarkOutlinedIcon className='hover:cursor-pointer text-papaya' onClick={() => setBookmarked(state => (!state))} />
                    }
                  </div>
                  {/* absolute flex flex-col top-1/2 -right-10 -translate-x-1/2 -translate-y-1/2 */}
                  <div className='flex-1 space-x-1 items-center opacity-80 hover:opacity-100'>
                    <div className='relative float-right flex space-x-1 items-center'>
                      <p className='absolute text-xs w-24 -right-1/3 -top-4'>Was this helpful?</p>
                        {
                          <>
                            <ThumbUpOutlinedIcon id={`thumbs-up-${id}`} className={`w-6 hover:cursor-pointer hover:scale-110 ${helpful ? `text-papaya` : `text-black`}}`} onClick={() => handleHelpfulClick(`thumbs-up-${id}`)} />
                            <ThumbDownOutlinedIcon id={`thumbs-down-${id}`} className={`w-6 hover:cursor-pointer hover:scale-110 ${helpful ? `text-papaya` : `text-black`}}`} onClick={() => handleHelpfulClick(`thumbs-down-${id}`)} />
                          </>                
                        }
                      
                    </div>
                  </div>
                </div>
              </div>

                

              </div>
          </>
        }

      </>

    )
}

export default Review