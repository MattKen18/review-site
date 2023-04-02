import React from 'react'
import InformCard from './InformCard'
import Loader from './Loader'
import Review from './Review'

const ShowContent = ({params: {content, type, endOfResults, updatingFeed, noResults}}) => {
  return (
    <div className='w-11/12 m-auto'>
      {
        type === 'reviews' &&
        content.map((review, i) => (
          <Review key={review.id+i} review={review} />
        )) 
      } 
      {
        endOfResults ?
          <InformCard params={{                                
            content: "No more results",
            type: "alert",
            emoji: "🫠",
          }}
          />
        :
        updatingFeed ?
        <Loader params={{
          // content: 'Loading more content',
          type: 'bars',
          color: '#3F51B5',
          height: '40px',
          width: '40px',
        }} />
        :
        noResults &&
          <InformCard params={{                                
            content: "No results match filter",
            subContent: "Please update filter and try again",
            type: "alert",
            emoji: '🥺',
          }}
        />
      }   
    </div>
  )
}

export default ShowContent