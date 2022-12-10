import { requirePropFactory } from '@mui/material'
import React, { useEffect, useState } from 'react'

const ReviewImageCarousel = ({ imgSources }) => {
  const [sources, setSources] = useState(imgSources)

  const cycleImageNext = () => {
    //current image is the first image in the array
    //previous image is the image at the end of the array

    //takes the current image and pushes it to the end of the array and the next element in the array becomes the current
    const newSources = [...sources]
    const prev = newSources.shift()
    newSources.push(prev) 
    setSources(newSources)
  }

  const cycleImagePrev = () => {
    const newSources = [...sources]
    const prev = newSources.pop()
    newSources.unshift(prev) 
    setSources(newSources)
  }


  return ( 

    <div className='group relative flex items-center justify-center overflow-hidden rounded-md h-[300px] bg-slate-200'>
      <img src={sources[0]} className='peer max-w-[250px] object-cover' />
      <button onClick={cycleImagePrev} className='absolute left-0 top-1/2 transform -translate-y-1/2 h-[50px] w-10 bg-slate-200 hidden group-hover:block opacity-75 hover:opacity-100'>
        {'<-'}
      </button>
      <button onClick={cycleImageNext} className='absolute right-0 top-1/2 transform -translate-y-1/2 h-[50px] w-10 bg-slate-200 hidden group-hover:block opacity-75 hover:opacity-100'>
        {'->'}
      </button>
    </div>
  )
}

export default ReviewImageCarousel