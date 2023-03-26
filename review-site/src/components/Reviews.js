import React from 'react'
import Review from './Review'

const Reviews = ({reviews}) => {
  return (
    <div>
      {reviews.map((review, i) => (
        <Review key={i} id={i} review={review} />
        )) 
      }
    </div>
  )
}

export default Reviews