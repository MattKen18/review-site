import React, { useRef } from 'react'
// import { StarIcon } from '@heroicons/react/24/solid'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { useEffect } from 'react'

const RatingStars = ({ rating}) => {
  const minFilled = Math.floor(rating)
  const partial = rating - minFilled > 0 ? true : false
  const starsList = []

  for (let i=0; i<5; i++) {
    if (i < minFilled) {
      starsList.push(<StarIcon key={i} className={`text-moss -ml-1`} fontSize='small' />)
    } else if (i == minFilled && partial) {
      starsList.push(<StarHalfIcon key={i} className={`text-moss -ml-1`} fontSize='small' />)
    } else {
      starsList.push(<StarBorderIcon key={i} className={`text-moss -ml-1`} fontSize='small' />)
    }
  }

  useEffect(() => {

    
  }
  , [])

  return (
    <div className='relative flex items-center'>
      {starsList.map(star => star)}  
    </div>
  )
}

export default RatingStars