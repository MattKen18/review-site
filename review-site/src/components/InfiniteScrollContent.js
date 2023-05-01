import React from 'react'
import InformCard from './InformCard'
import Loader from './Loader'
import Review from './Review'

const InfiniteScrollContent = ({params: {content, type, endOfResults, updatingFeed, noResults}}) => {
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
        <div className='w-40 m-auto flex flex-row justify-center items-center animate-pulse my-5'>
          <Loader params={{
            // content: 'Loading more content',
            type: 'bars',
            color: '#3F51B5',
            height: '30px',
            width: '30px',
          }} />
        </div>
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

export default InfiniteScrollContent