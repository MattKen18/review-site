import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReviewFromFirestore } from '../../firebase'

const DetailView = () => {
  const [review, setReview] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    getReviewFromFirestore(id).then((review) => setReview(review))
  }, [])

  useEffect(() => {
    console.log(review)
  }, [review])

  return (
    <div>
      <h1>{id}</h1>
    </div>
  )
}

export default DetailView