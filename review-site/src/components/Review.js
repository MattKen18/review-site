import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import React, { useEffect, useRef, useState } from 'react'
import RatingStars from './RatingStars'

const Review = ({id, review: {author, headline, body, genre: {title, color, border}, tag, age, image, numOfComments, rating}}) => {
  const [bookmarked, setBookmarked] = useState(false) //change to use selector to get list of bookmarked items of the user
  const [helpful, setHelpful] = useState(false) //true if the user selects 
  const [justClicked, setJustClicked] = useState(null)
  const genreColor = `${color}`

  console.log(helpful, justClicked)
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

  useEffect(() => {
    // update database if helpful changes, ie remove or add to user's helpful list 
    // or maybe add to review itself instead of user (or add to both) so i can have how many people
    // think its helpful/not helpful
  }, [helpful])

  return (
      <div className={`relative z-0 flex flex-col min-h-[300px] h-fit bg-white w-11/12 m-auto rounded-md shadow-sm mb-10 p-10 overflow-hidden`}>
        <div className={`absolute -top-20 -right-20 w-36 h-28 z-1 ${genreColor} rotate-45`}></div> 
        <div className='mb-5'>
          <p className='text-sm font-light'>{`'${tag}'`} <span className='opacity-70 font-extralight'>• {title}</span></p>
          <div className='flex space-x-8 items-center'>
            <h1 className='font-extrabold text-2xl'>{headline}</h1>
            <div className='flex'><RatingStars rating={rating} /><span className='font-light'>{rating}/5</span></div>
            
          </div>
        </div>
        <div className='flex-1 mb-5'>
          <p className='line-clamp-10'>{body}</p>
        </div>
        <div className='relative flex'>
          <div className='flex items-center space-x-8 text-sm'>
            <p className='opacity-80'><span className='p-1 border-2 border-slate-200 rounded-md bg-slate-200 opacity-60'>{age}</span> By {author}</p>
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
    )
}

export default Review