import React, { useEffect, useState } from 'react'

const ReviewImageCarousel = ({ imgSources }) => {
  const [sources, setSources] = useState(imgSources)
  const [goingNext, setGoingNext] = useState(false)
  const [goingPrev, setGoingPrev] = useState(false)

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

    <div className='group relative flex items-center justify-center overflow-hidden rounded-md w-[250px] h-[300px] bg-slate-200'>
      <div className={'relative flex justify-center items-center h-full'}>
        {/* <img src={sources[0]} className='absolute scale-150 opacity-100 h-[300px] w-[300px] blur-md' /> */}
        <img src={sources[0]} className='relative peer max-w-[250px] object-cover' loading='lazy' />
      </div>
      { sources.length > 1 &&
      <>
        <button onClick={cycleImagePrev} className='absolute -left-10 top-1/2 transform -translate-y-1/2 h-[75px] w-10 bg-slate-200 group-hover:block group-hover:translate-x-10 duration-300 opacity-75 hover:opacity-100'>
          {'<-'}
        </button>
        <button onClick={cycleImageNext} className='absolute -right-10 top-1/2 transform -translate-y-1/2 h-[75px] w-10 bg-slate-200 group-hover:block group-hover:-translate-x-10 duration-300 opacity-75 hover:opacity-100'>
          {'->'}
        </button>
      </>
      }
    </div>
  )
}

export default ReviewImageCarousel