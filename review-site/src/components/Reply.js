import React, { useEffect, useState } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import TimePassed from './TimePassed'
import { getUserFromFirestore } from '../firebase'


const Reply = ({reply}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [replyAuthor, setReplyAuthor] = useState(null)
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
    if (reply) {
      // try {
      getUserFromFirestore(reply?.author).then(author => setReplyAuthor(author))
      // } catch (e) {
        // setReplyAuthor('Anonymous')
      // }
    }

  }, [reply])

  useEffect(() => {
    // console.log("reply: ", reply)
  }, [reply])


  return (
    <div id={reply?.uid} className='flex space-x-2'>
      <span>
        {
          replyAuthor?.photoURL ? 
          <img src={replyAuthor?.photoURL} alt="profile pic" className='w-8 h-8 rounded-full object-cover' />
          :
          <UserCircleIcon className='w-8' />
        }
      </span>
      <div>
        <div className='flex space-x-2'>
          {
            !replyAuthor?.userName ? 
            <p className='text-sm font-bold'>Anonymous</p>
            :
            <a className='text-sm font-bold' href={`/user/${replyAuthor?.uid}/profile`}>{replyAuthor?.userName}</a>

          }
          <small className='text-xs opacity-70'><TimePassed timestamp={reply?.dateCreated} /></small>
        </div>
        <p className='text-xs'>{reply?.body}</p>
      </div>
    </div>
  )
}

export default Reply