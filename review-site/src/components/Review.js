import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import React, { useEffect } from 'react'
import RatingStars from './RatingStars'

const Review = ({review: {author, headline, body, genre: {title, color, border}, tag, age, image, numOfComments, rating}}) => {
  const genreColor = `${color}`

  return (
      <div className={`relative z-0 flex flex-col min-h-[400px] h-fit bg-white w-11/12 m-auto rounded-md shadow-sm mb-10 p-10 overflow-hidden`}>
        <div className={`absolute -top-20 -right-20 w-36 h-28 z-1 ${genreColor} rotate-45`}></div> 
        <div className='mb-5'>
          <p className='text-sm font-light'>{`'${tag}'`} <span className='opacity-70 font-extralight'>• {title}</span></p>
          <h1 className='font-extrabold text-2xl'>{headline}</h1>
        </div>
        <div className='flex-1 mb-5'>
          <p className='line-clamp-10'>{body}</p>
        </div>
        <div className='relative'>
          <div className='flex items-center space-x-8 text-sm opacity-80'>
            <p className=''><span className='p-1 border-2 border-slate-200 rounded-md bg-slate-200 opacity-60'>{age}</span> By {author}</p>
            <p className='flex items-center space-x-2'><ChatBubbleLeftIcon className='w-6' /> {numOfComments}</p>
            <div className='flex'><p className='mr-2'>Rating:</p><RatingStars rating={rating} /></div>
          </div>
          <div className='absolute flex flex-col top-1/2 -right-10 -translate-x-1/2 -translate-y-1/2 space-x-1 items-center opacity-80 hover:opacity-100'>
            <p className='text-xs'>Was this helpful?</p>
            <div className='flex space-x-1 items-center'>
              <HandThumbUpIcon className='w-6 hover:cursor-pointer hover:scale-110' />
              <HandThumbDownIcon className='w-6 hover:cursor-pointer hover:scale-110' />
            </div>
          </div>
        </div>

      </div>
    )
}

export default Review