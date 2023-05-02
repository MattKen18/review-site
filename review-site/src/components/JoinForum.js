import React, { useEffect, useState } from 'react'
import { joinForumWithCode } from '../firebase'

const JoinForum = ({user, joinForum}) => {
  const [forumCode, setForumCode] = useState('')
  const [forumName, setForumName] = useState('')

  const joinForumRoomWithCode = (e) => {
    e.preventDefault()

    console.log("forumCode: ", forumCode)
    joinForumWithCode(forumCode, user.uid, user.userName).then(forumId => {
      joinForum(forumId)
    })
  }

  return (
    <div className='pt-10'>
      <h1 className='font-bold text-xl text-center'>Join Forum</h1>
      <form className='pt-10' autoComplete='off'>
        <div className='flex space-x-2 items-center'>
          <input 
            type="text"
            id='forum-join-code'
            placeholder='Enter Code'
            value={forumCode}
            onChange={(e) => setForumCode(e.target.value.trim())}
            className='flex-1 outline-none p-2 rounded-md font-bold text-center text-xl opacity-90'
          />
          <button onClick={joinForumRoomWithCode} className='bg-blue-600 h-full text-white p-2 rounded-md'>Join</button>
        </div>
        <br />
        <br />
        <div className='relative flex w-full items-center h-[1px]'>
          <span className='w-full h-full bg-slate-300'></span>
          <p className='absolute left-1/2 -translate-x-1/2 px-2 bg-gray-100 font-bold'>or</p>
        </div>
        <br />
        <br />
        <div className='flex space-x-2 items-center'>
          <input 
            type="text"
            id='forum-join-name'
            placeholder='Enter Forum Name or Topic'
            value={forumName}
            onChange={(e) => setForumName(e.target.value)}
            className='flex-1 outline-none p-2 rounded-md font-bold text-lg opacity-90'
          />
          <button className='bg-blue-600 h-full text-white p-2 rounded-md'>Search</button>

        </div>
      </form>
    </div>
  )
}

export default JoinForum