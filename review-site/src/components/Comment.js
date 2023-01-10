import React, { useEffect, useState } from 'react'
import { addDislikeToComment, addLikeToComment, getComment, getUserFromFirestore, removeDislikeFromComment, removeLikeFromComment } from '../firebase'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import TimePassed from './TimePassed'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Comment = ({comment}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [commentAuthor, setCommentAuthor] = useState(null)
  const [repliesShown, setRepliesShown] = useState(false)
  const [commentLiked, setCommentLiked] = useState(null) //if the user has liked the comment false if disliked null if neither
  const [commentLikes, setCommentLikes] = useState(0)
  const [commentDislikes, setCommentDislikes] = useState(0)

  const auth = getAuth()

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
    getUserFromFirestore(comment.author).then(author => setCommentAuthor(author))
    setCommentLikes(comment.likes.length)
    setCommentDislikes(comment.dislikes.length)
  }, [comment])




  // check if comment has been liked or disliked by user
  useEffect(() => {
    if (comment?.likes?.indexOf(currentUser?.uid) !== -1) {
      setCommentLiked(true)
    } else if (comment?.dislikes?.indexOf(currentUser?.uid) !== -1) {
      setCommentLiked(false)
    } else {
      setCommentLiked(null) // user has not liked or disliked comment
    }
  }, [comment, currentUser])


  const handleLike = () => {
    try {
      if (commentLiked === null) {
        addLikeToComment(comment?.uid, currentUser?.uid)
        setCommentLiked(true)
        setCommentLikes(likes => likes+1)
      } else if (commentLiked === false) {
        addLikeToComment(comment?.uid, currentUser?.uid)
        setCommentLiked(true)
        setCommentLikes(likes => likes+1)
        setCommentDislikes(dislikes => dislikes-1)
        removeDislikeFromComment(comment?.uid, currentUser?.uid)
      } else {
        removeLikeFromComment(comment?.uid, currentUser?.uid)
        setCommentLikes(likes => likes-1)
        setCommentLiked(null) //if clicked on like button and already liked then reset
      }
    } catch (e) {
      console.log('error liking comment: ', e)
    }
  }

  const handleDislike = () => {
    try {
      if (commentLiked === null) {
        addDislikeToComment(comment?.uid, currentUser?.uid)
        setCommentLiked(false)
        setCommentDislikes(dislikes => dislikes+1)
      } else if (commentLiked) {
        addDislikeToComment(comment?.uid, currentUser?.uid)
        setCommentLiked(false)
        setCommentDislikes(dislikes => dislikes+1)
        setCommentLikes(likes => likes-1)
        removeLikeFromComment(comment?.uid, currentUser?.uid)
      } else {
        removeDislikeFromComment(comment?.uid, currentUser?.uid)
        setCommentDislikes(dislikes => dislikes-1)
        setCommentLiked(null) //if clicked on dislike button and already disliked then reset
      }
    } catch (e) {
      console.log('error liking comment: ', e)
    }
  }

  return (
    <div className='flex space-x-2'>
      <span>
        {
          commentAuthor?.photoURL ? 
          <img src={commentAuthor?.photoURL} alt="profile pic" />:
          <UserCircleIcon className='w-12' />
        }
      </span>
      <div className='flex flex-col space-y-1'>
        <div className='flex items-center space-x-1'>
          <p className='text-sm font-bold'>{commentAuthor?.userName}</p>
          <small className='opacity-70 text-xs'><TimePassed timestamp={comment?.dateCreated} /></small>
        </div>
        <p>{comment?.body}</p> 
        <div className='flex space-x-2'>
          <div className='flex space-x-1'>
            <button className='text-xs' onClick={() => handleLike()}><ThumbUpOutlinedIcon className={`p-1 rounded-full  duration-100 ${commentLiked ? `bg-papaya text-white` : `hover:text-papaya`}`} /> {commentLikes}</button>
            <button className='text-xs' onClick={() => handleDislike()}><ThumbDownOutlinedIcon className={`p-1 active:scale-90 duration-100 rounded-full ${commentLiked === false ? `bg-papaya text-white` : `hover:text-papaya`}`} /> {commentDislikes}</button>
          </div>
          <button className='text-xs text-papaya' onClick={() => setRepliesShown(shown => !shown)}>{repliesShown ? <ArrowDropDownOutlinedIcon /> : <ArrowDropUpOutlinedIcon />}2 replies</button>
          <button className='relative text-xs rounded-md duration-100 underline underline-offset-4'>reply</button>
        </div>
      </div>
    </div>
  )
}

export default Comment