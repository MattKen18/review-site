import React, { useEffect, useState } from 'react'
import { addDislikeToComment, addLikeToComment, addReplyToComment, getComment, getCommentReplies, getUserFromFirestore, removeDislikeFromComment, removeLikeFromComment } from '../firebase'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import TimePassed from './TimePassed'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import $ from 'jquery'
import Reply from './Reply';
import { useNavigate } from 'react-router-dom';

const Comment = ({comment}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [commentAuthor, setCommentAuthor] = useState(null)
  const [repliesShown, setRepliesShown] = useState(false)
  const [commentLiked, setCommentLiked] = useState(null) //if the user has liked the comment false if disliked null if neither
  const [commentLikes, setCommentLikes] = useState(0)
  const [commentDislikes, setCommentDislikes] = useState(0)
  const [replyBody, setReplyBody] = useState('')
  const [replies, setReplies] = useState([])
  const [numOfReplies, setNumOfReplies] = useState(0)

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
    getUserFromFirestore(comment.author).then(author => setCommentAuthor(author))
    setCommentLikes(comment.likes.length)
    setCommentDislikes(comment.dislikes.length)
  }, [comment])


  const getReplies = () => {
    getCommentReplies(comment?.uid).then(replies => setReplies(replies))
  }

  useEffect(() => {
    if (replies) {
      setNumOfReplies(replies.length)
    }

  }, [replies])


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

    if (!currentUser) {
      navigate('/login-signup')
    }
    
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

    if (!currentUser) {
      navigate('/login-signup')
    }

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

  const toggleReplyForm = () => {
    $('#reply-form-'+comment?.uid).toggle()
  }

  const addReply = (e) => {
    e.preventDefault()

    if (!currentUser) {
      navigate('/login-signup')
    }

    addReplyToComment(comment?.uid, currentUser?.uid, replyBody).then(reply => {
      const updatedReplies = [...replies]
      updatedReplies.unshift(reply)
      setReplies(updatedReplies)

    })
    setReplyBody('')
  }

  const toggleReplies = () => {
    $('#replies-container-'+comment?.uid).toggle()
    setRepliesShown(shown => !shown)
  }

  // useEffect(() => {
  //   if (repliesShown) {
  //     getReplies()
  //   }
  // }, [repliesShown])

  useEffect(() => {
    if (comment) {
      getReplies()
    }
  }, [comment])

  return (
    <div className='flex space-x-2 w-8/12'>
      <span>
        {
          commentAuthor?.photoURL ? 
          <img src={commentAuthor?.photoURL} alt="profile pic" className='w-10 h-10 rounded-full object-cover' />:
          <UserCircleIcon className='w-12' />
        }
      </span>
      <div className='flex flex-col space-y-1 w-full'>
        <div className='flex items-center space-x-1'>
          {
            comment.anonymous ? 
            <p className='text-sm font-bold'>Anonymous</p>
            :
            <a className='text-sm font-bold' href={`/user/${commentAuthor?.uid}/profile`}>{commentAuthor?.userName}</a>

          }
          {/* <p className='text-sm font-bold'>{comment.anonymous ? "Anonymous" : commentAuthor?.userName}</p> */}
          <small className='opacity-70 text-xs'><TimePassed timestamp={comment?.dateCreated} /></small>
        </div>
        <p>{comment?.body}</p> 
        <div className='flex space-x-2'>
          <div className='flex space-x-1'>
            <button className='text-xs' onClick={() => handleLike()}><ThumbUpOutlinedIcon className={`p-1 rounded-full  duration-100 ${commentLiked ? `bg-papaya text-white` : `hover:text-papaya`}`} /> {commentLikes}</button>
            <button className='text-xs' onClick={() => handleDislike()}><ThumbDownOutlinedIcon className={`p-1 active:scale-90 duration-100 rounded-full ${commentLiked === false ? `bg-papaya text-white` : `hover:text-papaya`}`} /> {commentDislikes}</button>
          </div>
          <button className='text-xs text-papaya' onClick={() => toggleReplies()}>
            {
              numOfReplies > 0 ?
              <>
                {
                  repliesShown ? <ArrowDropDownOutlinedIcon /> : <ArrowDropUpOutlinedIcon />
                }
                {numOfReplies + ' replies'}
              </> :
              <>
              </>

            }
            {/* {repliesShown ? <ArrowDropDownOutlinedIcon /> : <ArrowDropUpOutlinedIcon />}{numOfReplies > 0 ? numOfReplies + ' replies' : 'No replies'} */}
            </button>
          <button onClick={() => toggleReplyForm()} className='relative text-xs rounded-md duration-100 underline underline-offset-4'>reply</button>
        </div>
        <div>
          <form id={'reply-form-'+comment?.uid} className='relative hidden w-full mb-6 mt-2' onSubmit={addReply}>
            <div className='flex space-x-2'>
              <span>
                {
                  currentUser?.photoURL ? 
                  <img src={currentUser?.photoURL} alt="profile pic" className='w-8 h-8 rounded-full object-cover' />:
                  <UserCircleIcon className='w-8' />
                }
              </span>
              <input 
                id='reply-form-input'
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                type="text"
                aria-label='reply form'
                placeholder='Start your reply...'
                className='text-sm w-full py-2 opacity-70 focus:opacity-100 focus:outline-none border-b-2 border-slate-500 bg-transparent'
                autoComplete='off'
              />
              <button className='absolute right-0 hover:text-papaya disabled:hover:text-inherit' disabled={replyBody.trim() === '' ? true : false}><SendOutlinedIcon className='transform' /></button>

            </div>
          </form>
          <div className='mt-4 hidden' id={'replies-container-'+comment?.uid}>
            <div className='flex flex-col space-y-4'>
              {
                replies?.map((reply, id) => (
                  <Reply key={reply.uid+id} reply={reply} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment