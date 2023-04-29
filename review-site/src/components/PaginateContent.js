import React, { useEffect } from 'react'
import Review from './Review'

const PaginateContent = ({params: {content, type, endOfResults, updatingFeed, noResults}}) => {

  useEffect(() => {
    // console.log("content: ", content)
  }, [])

  return (
    <div className='w-11/12 m-auto'>
      {
        type === 'reviews' &&
        content?.map((review, i) => (
          <Review key={review.id+i} review={review} />
        )) 
      }
    </div>
  )
}

export default PaginateContent