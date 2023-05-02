import React, { useEffect, useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Link } from 'react-router-dom';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

const ChatEntry = ({chatEntryDetails, forumMembers, currentUser}) => {
  
  const [chatEntryAuthor, setChatEntryAuthor] = useState(null)
  const [isAuthor, setIsAuthor] = useState(null) // if the current user is the author of the chat entry
  const [createdTimestamp, setCreatedTimestamp] = useState('')
  const [userForumState, setUserForumState] = useState('') // user joined or left in chatEntry
  
  const [optionsShown, setOptionsShown] = useState(false) // options menu shown or not

  useEffect(() => {
    if (chatEntryDetails.type === 'notification') {
      if (chatEntryDetails.body.includes('joined')) {
        setUserForumState('joined')
      } else if (chatEntryDetails.body.includes('left')) {
        setUserForumState('left')
      }
    }
  }, [chatEntryDetails])

  useEffect(() => {
    const fullTime = chatEntryDetails.created.toDate().toLocaleTimeString().split(':')
    const condensedTime = fullTime.slice(0, 2).join(":") + " " +fullTime[fullTime.length-1].split(' ')[1]

    setCreatedTimestamp(condensedTime)
  }, [chatEntryDetails])


  useEffect(() => {
    if (chatEntryAuthor && currentUser) {
      setIsAuthor(currentUser.uid === chatEntryAuthor.uid)
    }
  }, [currentUser, chatEntryAuthor])


  useEffect(() => {
    // console.log("forum members: ", forumMembers)
    if (Object.keys(forumMembers).length !== 0) {
      setChatEntryAuthor(forumMembers[chatEntryDetails.user])
    }
  }, [forumMembers])


  useEffect(() => {
    if (chatEntryDetails) {
      // console.log(chatEntryDetails.user)
    }
  }, [chatEntryDetails])
  

  useEffect(() => {
    if (chatEntryAuthor) {
      // console.log("chat Entry Author: ", chatEntryAuthor.userName)
    }
  }, [chatEntryAuthor])


  const handleShowOptions = () => {
    setOptionsShown(prev => !prev)
  }

  // handles clicking outside of options menu
  useEffect(() => {
    if ((isAuthor === false || isAuthor) && chatEntryDetails.type !== 'notification') {
      const optionsMenu = document.getElementById('chatEntry-options-menu-'+chatEntryDetails.id)
      const chatEntry = document.getElementById('chatEntry-'+chatEntryDetails.id)
      // console.log(chatEntry)
      // console.log(optionsMenu)
      // const optionsButton = document.getElementById('chatEntry-options-button-'+chatEntryDetails.id)
  
      
      const handleClickOutside = (e) => {

        // const clickedOptionsBtn = e.target === optionsButton || e.target.closest("button") === optionsButton
        const clickedOutsideOptions = !optionsMenu.contains(e.target)
        const clickedWithinChatEntry = chatEntry.contains(e.target)

        // if (clickedWithinChatEntry && clickedOutsideOptions && optionsShown) {
        //   e.preventDefault()
        //   // setOptionsShown(false)
        // }

        if (clickedWithinChatEntry && clickedOutsideOptions && optionsShown) {
          e.preventDefault()
        } else if (!clickedWithinChatEntry) { //if click is outside of the options menu
          setOptionsShown(false)
        }
      }
  
      document.addEventListener('click', handleClickOutside)
  
      return () => document.removeEventListener('click', handleClickOutside)

    }
  }, [isAuthor, optionsShown])


  useEffect(() => {

  }, [])

  return (
    <div className='text-white'>
      {
        chatEntryDetails?.type === 'message' ?
          isAuthor ? 
            <div className={`relative group flex w-full p-2 mb-3 justify-end`}>

              {/* chatEntry Content */}
              <div id={'chatEntry-'+chatEntryDetails.id} className={`group relative`}>
                <div className={`flex space-x-2 rounded-xl text-white ${optionsShown && `opacity-50`}`}>
                  {/* profile thumbnail */}
                  <div className='w-8 h-8 overflow-hidden rounded-full'>
                    <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                  </div>

                  {/* chat content */}
                  <div className='relative flex flex-col'>
                    {/* chat body */}
                    <div className='flex flex-col w-fit'>
                      <small className='text-[.55rem] font-bold'><a href={`/user/${chatEntryAuthor?.uid}/profile`}>{chatEntryAuthor?.userName}</a></small>
                      <p className='bg-primary p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[30px]'>{chatEntryDetails.body}</p>
                    </div>
                    {/* extra content */}
                    <div className=' flex justify-between items-center pl-1 opacity-80'>
                      <small className='text-2xs w-fit'>{createdTimestamp}</small>
                      <small className={`${optionsShown && `text-white`} group-hover:text-white text-transparent`}><UndoOutlinedIcon className={'hover:text-amber-600 hover:cursor-pointer'} sx={{ fontSize: 12 }} /></small>
                    </div>
                    
                  </div>
                </div>

                {/* more options button */}
                <div id={'chatEntry-options-menu-'+chatEntryDetails.id} className={`absolute top-0 -left-8 group-hover:block ${!optionsShown && `hidden`}`}>
                  <button onClick={handleShowOptions}>
                    <MoreVertOutlinedIcon className='' />
                  </button>
                  <div className={`absolute top-8 left-2 z-[10000] ${optionsShown ? 'block' : 'hidden'} w-20 h-fit bg-gray-300 rounded-lg overflow-hidden`}>
                    <ul className='text-body font-[400] hover:cursor-pointer text-sm'>
                      <li className='hover:bg-amber-600 hover:text-white py-1 pl-2'>Reply</li>
                      <li className='hover:bg-primary hover:text-white py-1 pl-2'>Edit</li>
                      <li className='hover:bg-error hover:text-white py-1 pl-2'>Remove</li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          :
            <div className={`relative group flex w-full p-2 mb-3`}>

              {/* chatEntry Content */}
              <div id={'chatEntry-'+chatEntryDetails.id} className={`relative`}>
                <div className={`flex space-x-2 rounded-xl text-white ${optionsShown && `opacity-50`}`}>
                  {/* profile thumbnail */}
                  <div className='w-8 h-8 overflow-hidden rounded-full'>
                    <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                  </div>

                  {/* chat content */}
                  <div className='relative flex flex-col'>
                    {/* chat body */}
                    <div className='flex flex-col w-fit'>
                    <small className='text-2xs font-bold'><a href={`/user/${chatEntryAuthor?.uid}/profile`}>{chatEntryAuthor?.userName}</a></small>
                      <p className='bg-slate-700 p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[30px]'>{chatEntryDetails.body}</p>
                    </div>
                    {/* extra content */}
                    <div className='flex flex-end pl-1 opacity-80'>
                      <small className='text-2xs w-fit'>{createdTimestamp}</small>
                    </div>
                    
                  </div>
                </div>

                {/* more options button */}
                <div id={'chatEntry-options-menu-'+chatEntryDetails.id} className={`absolute top-0 -left-8 group-hover:block ${!optionsShown && `hidden`}`}>
                  <button onClick={handleShowOptions}>
                    <MoreVertOutlinedIcon className='' />
                  </button>
                  <div className={`absolute top-8 left-2 z-[10000] ${optionsShown ? 'block' : 'hidden'} w-20 h-20 bg-white rounded-lg`}>

                  </div>
                </div>

              </div>

            </div>
        :
        chatEntryDetails.type === 'notification' &&
          <div className='flex items-center justify-center w-full mb-5'>
            <div className='w-fit flex flex-col -space-y-3 justify-center'>
              <h1 className={`font-bold text-sm opacity-70 ${userForumState === 'joined' ? 'text-emerald-400' : 'text-pink-500'}`}>{chatEntryDetails.body}</h1>
              <div className=''>
                <small className='text-2xs opacity-80'>{createdTimestamp}</small>
              </div>
            </div>
          </div>
      }

    </div>
  )
}

export default ChatEntry