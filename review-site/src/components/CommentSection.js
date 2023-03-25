import React, { useEffect, useState } from 'react'
import Comment from './Comment'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addCommentToReview, getReviewComments } from '../firebase';
import { UserCircleIcon } from '@heroicons/react/24/solid'
import Alert from './Alert';
import { useNavigate } from 'react-router-dom';

const CommentSection = ({review}) => {
  const [body, setBody] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [alert, setAlert] = useState(null)
  const [numOfComments, setNumOfComments] = useState(0)
  const [reviewComments, setReviewComments] = useState([])

  const auth = getAuth()
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
  }, [])

  useEffect(() => {
    setNumOfComments(review?.comments?.length)
  }, [review])

  useEffect(() => {
    if (review) {
      getReviewComments(review.id).then(comments => setReviewComments(comments))
    }
  }, [review])

  useEffect(() => {
    console.log("review comments: ", reviewComments)
  }, [reviewComments])

  const handleCommentCreation = (e) => {
    e.preventDefault()

    if (!currentUser) { //if user is not logged in then stop them from creating comment
      navigate('/login-signup')
    }

    try {
      // console.log("currentUser: ", currentUser.isAnonymous)
      addCommentToReview(review.id, currentUser.uid, body.trim(), currentUser.isAnonymous).then(comment => {
        // console.log("comment just created: ", comment)
        const updatedReviews = [...reviewComments]
        updatedReviews.unshift(comment)
        setReviewComments(updatedReviews)
      })
      setBody('')
      setAlert({body: "Comment added", type: "success"})
      setNumOfComments(state => state+1)

    } catch (e) {
      console.log(e)
      setAlert({body: "Error adding comment", type: "error"})

    }
  }

  useEffect(() => {
    setTimeout(() => {
      setAlert(null)
    }, 1000);
  }, [alert])


  return (
    <div>
      <div className='h-10'>
        {
          alert &&
          <Alert content={{body: alert.body, type: alert.type}} />
        }
      </div>
      <h1 className='font-bold text-lg'>Comments <span className='font-normal font-body text-sm'>{numOfComments}</span></h1>
      <div className='flex space-x-2 mb-10'>
        <span className='flex items-center justify-center'>
          {
            currentUser?.photoURL ? 
            <img src={currentUser?.photoURL} alt="user profile image" className='w-10 h-10 rounded-full object-cover' /> :
            <UserCircleIcon className='w-12'/>
          }
        </span>
        <form id="comment-form" className='relative mt-3 flex-1' onSubmit={handleCommentCreation} autoComplete='off'>
          <input
            id='comment-form-input'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className='w-full py-2 opacity-70 focus:opacity-100 focus:outline-none border-b-2 border-slate-500 bg-transparent' 
            type="text"
            aria-label='write comment'
            placeholder='Write comment...'
          />
          <button className='absolute right-0 hover:text-primary disabled:hover:text-inherit' disabled={body.trim() === '' ? true : false}><SendOutlinedIcon className='transform' /></button>
        </form>
      </div>
      <div className='flex flex-col space-y-6'>
        {
          reviewComments.map((comment, i) => (
            <Comment key={comment.uid + i} comment={comment} />
          ))
        }
      </div>
    </div>
  )
}

export default CommentSection