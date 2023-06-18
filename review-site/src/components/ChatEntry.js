import React, { useEffect, useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Link } from 'react-router-dom';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

const ChatEntry = ({chatEntryDetails, forumMembers, currentUser, startEdit, startReply, deleteChatEntry}) => {
  
  const [chatEntryAuthor, setChatEntryAuthor] = useState(null)
  const [isAuthor, setIsAuthor] = useState(null) // if the current user is the author of the chat entry
  const [createdTimestamp, setCreatedTimestamp] = useState('')
  const [replyCreatedTimestamp, setReplyCreatedTimestamp] = useState('')
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

    if (chatEntryDetails.replyingTo) {
      const fullTime = chatEntryDetails.replyingTo.created.toDate().toLocaleTimeString().split(':')
      const condensedTime = fullTime.slice(0, 2).join(":") + " " +fullTime[fullTime.length-1].split(' ')[1]
      setReplyCreatedTimestamp(condensedTime)
    }

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
    if ((isAuthor === false || isAuthor) && !['notification', 'deleted'].includes(chatEntryDetails.type)) {
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


  const handleStartEdit = () => {
    startEdit(chatEntryDetails, chatEntryAuthor)
    setOptionsShown(false)
  }

  const handleStartReply = () => {
    startReply(chatEntryDetails, chatEntryAuthor)
    setOptionsShown(false)
  }

  useEffect(() => {

  }, [])

  return (
    <div className='text-white'>
      {
        chatEntryDetails?.type === 'message' ?
          chatEntryDetails?.replyingTo ?
            // if chat entry is a reply 
            isAuthor ? 
              <div className={`relative flex flex-col w-full p-2 mb-3 items-end` }>
                {/* chatEntry Content */}
                <div className={`relative flex flex-col items-end`}>
                
                {/* Replying to section */}
                  <div className='flex flex-col mb-2 -ml-8'>
                    {/* <small className='text-2xs mb-2'>Replying to: {chatEntryDetails?.replyingTo.userName}</small> */}

                    <div>
                      <div className={`relative flex space-x-2 rounded-xl text-white opacity-60 hover:opacity-100 hover:cursor-pointer mb-2`}>
                        {/* profile thumbnail */}
                        {/* <div className='w-8 h-8 overflow-hidden rounded-full'>
                          <img src={chatEntryDetails.replyingTo?.author.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                        </div> */}

                        {/* chat content */}
                        <div className='relative flex flex-col'>
                          {/* chat body */}
                          <div className='flex flex-col w-fit'>
                            <a href={`/user/${chatEntryDetails.replyingTo?.author.uid}/profile`} className='w-full hover:text-[#94D096]'><small className='text-[.55rem] font-bold'>{chatEntryDetails.replyingTo?.author.userName}</small></a>
                            <div className='bg-amber-700 p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[75px] max-w-[250px] '>
                              <p className='w-full h-full line-clamp-1 relative'>{chatEntryDetails.replyingTo?.body}</p>
                            </div>
                          </div>
                          {/* extra content */}
                          <div className=' flex justify-between items-center pl-1 opacity-80'>
                            <small className='text-2xs w-fit'>{replyCreatedTimestamp}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>




                  {/* response section */}
                  <div id={'chatEntry-'+chatEntryDetails.id} className={`relative group pl-12`}>
                    <div className={`relative flex rounded-xl text-white flex-row-reverse ${optionsShown && `opacity-50`}`}>
                      {/* profile thumbnail */}
                      <div className='relative before:absolute before:w-[2px] before:h-5 before:bg-gray-200 before:opacity-20 before:-top-6 before:left-1/2 before:-translate-x-1/2 ml-2'>
                        <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-8 h-8 overflow-hidden rounded-full block ${optionsShown && `hover:cursor-default`}`}>
                          <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                        </a>
                      </div>

                      {/* chat content */}
                      <div className='relative flex flex-col'>
                        {/* chat body */}
                        <div className='flex flex-col w-fit'>
                          <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-full text-right ${!optionsShown ? `hover:text-[#94D096]` : `cursor-default`}`}><small className='text-[.55rem] font-bold'>{chatEntryAuthor?.userName}</small></a>
                          <div className='bg-primary p-2 pl-1 pt-[1px] rounded-lg rounded-tr-none min-w-[75px] max-w-[250px] '>
                            <p className='w-full h-full break-words relative'>{chatEntryDetails?.body}</p>
                          </div>
                        </div>
                        {/* extra content */}
                        <div className=' flex justify-between items-center pl-1 opacity-80'>
                          <small className='text-2xs w-fit'>{createdTimestamp}</small>
                          <small onClick={() => handleStartReply()} className={`${optionsShown && `text-white`} group-hover:text-white text-transparent`}><UndoOutlinedIcon className={'hover:text-amber-600 hover:cursor-pointer'} sx={{ fontSize: 12 }} /></small>
                        </div>
                        {
                          chatEntryDetails.edited &&
                            <small className='text-2xs -mt-1 pl-1'>edited</small>
                        }
                      </div>
                    </div>
                    {/* more options button */}
                    <div id={'chatEntry-options-menu-'+chatEntryDetails.id} className={`absolute top-1 left-4 group-hover:block ${!optionsShown && `hidden`}`}>
                      <button onClick={handleShowOptions} className={`hover:text-[#94D096] ${optionsShown && `text-[#94D096]`}`}>
                        <MoreVertOutlinedIcon className='' />
                      </button>
                      <div className={`absolute top-8 left-4 z-[10000] ${optionsShown ? 'block' : 'hidden'} w-20 h-fit bg-gray-300 rounded-lg overflow-hidden`}>
                        <ul className='text-body font-[400] hover:cursor-pointer text-sm'>
                          <li onClick={() => handleStartReply()} className='hover:bg-amber-600 hover:text-white py-1 pl-2'>Reply</li>
                          <li className='hover:bg-primary hover:text-white py-1 pl-2'>Copy</li>
                          <li onClick={() => handleStartEdit()} className='hover:bg-green-700 hover:text-white py-1 pl-2'>Edit</li>
                          <li onClick={() => deleteChatEntry(chatEntryDetails.id, chatEntryDetails.forum)} className='hover:bg-error hover:text-white py-1 pl-2'>Remove</li>
                        </ul>
                      </div>
                    </div>
                  </div>


                </div>

              </div>
            :
              <div className={`relative flex flex-col w-full p-2 mb-3`}>
                {/* chatEntry Content */}
                <div className={`relative flex flex-col items-start`}>


                  {/* Replying to section */}
                  <div className='flex flex-col mb-2 -mr-8'>
                    {/* <small className='text-2xs mb-2'>Replying to: {chatEntryDetails?.replyingTo.userName}</small> */}

                    <div>
                      <div className={`relative flex space-x-2 rounded-xl text-white opacity-60 hover:opacity-100 hover:cursor-pointer mb-2`}>
                        {/* profile thumbnail */}
                        {/* <div className='w-8 h-8 overflow-hidden rounded-full'>
                          <img src={chatEntryDetails.replyingTo?.author.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                        </div> */}

                        {/* chat content */}
                        <div className='relative flex flex-col'>
                          {/* chat body */}
                          <div className='flex flex-col w-fit'>
                            <a href={`/user/${chatEntryDetails.replyingTo?.author.uid}/profile`} className='w-full hover:text-[#94D096]'><small className='text-[.55rem] font-bold'>{chatEntryDetails.replyingTo?.author.userName}</small></a>
                            <div className='bg-amber-700 p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[75px] max-w-[250px] '>
                              <p className='w-full h-full line-clamp-1 relative'>{chatEntryDetails.replyingTo?.body}</p>
                            </div>
                          </div>
                          {/* extra content */}
                          <div className=' flex justify-between items-center pl-1 opacity-80'>
                            <small className='text-2xs w-full text-right'>{replyCreatedTimestamp}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* response section */}
                  <div id={'chatEntry-'+chatEntryDetails.id} className={`relative group pr-12`}>
                    <div className={`relative flex rounded-xl space-x-2 text-white ${optionsShown && `opacity-50`}`}>
                      {/* profile thumbnail */}
                      <div className='relative before:absolute before:w-[2px] before:h-5 before:bg-gray-200 before:opacity-20 before:-top-6 before:left-1/2 before:-translate-x-1/2 ml-2'>
                        <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-8 h-8 overflow-hidden rounded-full block ${optionsShown && `hover:cursor-default`}`}>
                          <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                        </a>
                      </div>

                      {/* chat content */}
                      <div className='relative flex flex-col'>
                        {/* chat body */}
                        <div className='flex flex-col w-fit'>
                          <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-full ${!optionsShown ? `hover:text-[#94D096]` : `cursor-default`}`}><small className='text-[.55rem] font-bold'>{chatEntryAuthor?.userName}</small></a>
                          <div className='bg-slate-700 p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[75px] max-w-[250px] '>
                            <p className='w-full h-full break-words relative'>{chatEntryDetails?.body}</p>
                          </div>
                        </div>
                        {/* extra content */}
                        <div className=' flex justify-between items-center pl-1 opacity-80'>
                          <small className='text-2xs w-fit'>{createdTimestamp}</small>
                          <small onClick={() => handleStartReply()} className={`${optionsShown && `text-white`} group-hover:text-white text-transparent`}><UndoOutlinedIcon className={'hover:text-amber-600 hover:cursor-pointer'} sx={{ fontSize: 12 }} /></small>
                        </div>
                        {
                          chatEntryDetails.edited &&
                            <small className='text-2xs -mt-1 pl-1'>edited</small>
                        }
                      </div>
                    </div>
                    {/* more options button */}
                    <div id={'chatEntry-options-menu-'+chatEntryDetails.id} className={`absolute top-1 right-4 group-hover:block ${!optionsShown && `hidden`}`}>
                      <button onClick={handleShowOptions} className={`hover:text-[#94D096] ${optionsShown && `text-[#94D096]`}`}>
                        <MoreVertOutlinedIcon className='' />
                      </button>
                      <div className={`absolute top-8 left-4 z-[10000] ${optionsShown ? 'block' : 'hidden'} w-20 h-fit bg-gray-300 rounded-lg overflow-hidden`}>
                        <ul className='text-body font-[400] hover:cursor-pointer text-sm'>
                          <li onClick={() => handleStartReply()} className='hover:bg-amber-600 hover:text-white py-1 pl-2'>Reply</li>
                          <li className='hover:bg-primary hover:text-white py-1 pl-2'>Copy</li>
                          <li onClick={() => handleStartEdit()} className='hover:bg-green-700 hover:text-white py-1 pl-2'>Edit</li>
                          <li onClick={() => deleteChatEntry(chatEntryDetails.id, chatEntryDetails.forum)} className='hover:bg-error hover:text-white py-1 pl-2'>Remove</li>
                        </ul>
                      </div>
                    </div>
                  </div>


                </div>

              </div>
          : //if chat entry is not a reply
            isAuthor ? 
              <div className={`relative flex w-full p-2 mt-2 justify-end`}>
                {/* chatEntry Content */}
                <div id={'chatEntry-'+chatEntryDetails.id} className={`relative group pl-12 before:absolute`}>
                    <div className={`relative flex rounded-xl text-white flex-row-reverse ${optionsShown && `opacity-50`}`}>
                      {/* profile thumbnail */}
                      <div className='relative ml-2'>
                        <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-8 h-8 overflow-hidden rounded-full block ${optionsShown && `hover:cursor-default`}`}>
                          <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                        </a>
                      </div>

                      {/* chat content */}
                      <div className='relative flex flex-col'>
                        {/* chat body */}
                        <div className='flex flex-col w-fit'>
                          <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-full text-right ${!optionsShown ? `hover:text-[#94D096]` : `cursor-default`}`}><small className='text-[.55rem] font-bold'>{chatEntryAuthor?.userName}</small></a>
                          <div className='bg-primary p-2 pl-1 pt-[1px] rounded-lg rounded-tr-none min-w-[75px] max-w-[250px] '>
                            <p className='w-full h-full break-words relative'>{chatEntryDetails?.body}</p>
                          </div>
                        </div>
                        {/* extra content */}
                        <div className=' flex justify-between items-center pl-1 opacity-80'>
                          <small className='text-2xs w-fit'>{createdTimestamp}</small>
                          <small onClick={() => handleStartReply()} className={`${optionsShown && `text-white`} group-hover:text-white text-transparent`}><UndoOutlinedIcon className={'hover:text-amber-600 hover:cursor-pointer'} sx={{ fontSize: 12 }} /></small>
                        </div>
                        {
                          chatEntryDetails.edited &&
                            <small className='text-2xs -mt-1 pl-1'>edited</small>
                        }
                      </div>
                    </div>
                    {/* more options button */}
                    <div id={'chatEntry-options-menu-'+chatEntryDetails.id} className={`absolute top-1 left-4 group-hover:block ${!optionsShown && `hidden`}`}>
                      <button onClick={handleShowOptions} className={`hover:text-[#94D096] ${optionsShown && `text-[#94D096]`}`}>
                        <MoreVertOutlinedIcon className='' />
                      </button>
                      <div className={`absolute top-8 left-4 z-[10000] ${optionsShown ? 'block' : 'hidden'} w-20 h-fit bg-gray-300 rounded-lg overflow-hidden`}>
                        <ul className='text-body font-[400] hover:cursor-pointer text-sm'>
                          <li onClick={() => handleStartReply()} className='hover:bg-amber-600 hover:text-white py-1 pl-2'>Reply</li>
                          <li className='hover:bg-primary hover:text-white py-1 pl-2'>Copy</li>
                          <li onClick={() => handleStartEdit()} className='hover:bg-green-700 hover:text-white py-1 pl-2'>Edit</li>
                          <li onClick={() => deleteChatEntry(chatEntryDetails.id, chatEntryDetails.forum)} className='hover:bg-error hover:text-white py-1 pl-2'>Remove</li>
                        </ul>
                      </div>
                    </div>
                  </div>

              </div>
            :
              <div className={`relative flex w-full p-2 mb-3 justify-start`}>
                {/* chatEntry Content */}
                <div id={'chatEntry-'+chatEntryDetails.id} className={`relative`}>

                  <div className={`relative group pr-10`}>
                    <div className={`relative flex space-x-2 rounded-xl text-white ${optionsShown && `opacity-50`}`}>
                      {/* profile thumbnail */}
                      <div className='relative ml-2'>
                        <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-8 h-8 overflow-hidden rounded-full block ${optionsShown && `hover:cursor-default`}`}>
                          <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                        </a>
                      </div>

                      {/* chat content */}
                      <div className='relative flex flex-col'>
                        {/* chat body */}
                        <div className='flex flex-col w-fit'>
                          <a href={`/user/${chatEntryAuthor?.uid}/profile`} className={`w-full ${!optionsShown ? `hover:text-[#94D096]` : `cursor-default`}`}><small className='text-[.55rem] font-bold'>{chatEntryAuthor?.userName}</small></a>
                          <div className='bg-slate-700 p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[75px] max-w-[250px] '>
                            <p className='w-full h-full break-words relative'>{chatEntryDetails?.body}</p>
                          </div>
                        </div>
                        {/* extra content */}
                        <div className=' flex justify-between items-center pl-1 opacity-80'>
                          <small className='text-2xs w-fit'>{createdTimestamp}</small>
                          <small onClick={() => handleStartReply()} className={`${optionsShown && `text-white`} group-hover:text-white text-transparent`}><UndoOutlinedIcon className={'hover:text-amber-600 hover:cursor-pointer'} sx={{ fontSize: 12 }} /></small>
                        </div>
                        {
                          chatEntryDetails.edited &&
                            <small className='text-2xs -mt-1 pl-1'>edited</small>
                        }
                      </div>
                    </div>
                    {/* more options button */}
                    <div id={'chatEntry-options-menu-'+chatEntryDetails.id} className={`absolute top-1 right-3 group-hover:block ${!optionsShown && `hidden`}`}>
                      <button onClick={handleShowOptions} className={`hover:text-[#94D096] ${optionsShown && `text-[#94D096]`}`}>
                        <MoreVertOutlinedIcon className='' />
                      </button>
                      <div className={`absolute top-8 left-4 z-[10000] ${optionsShown ? 'block' : 'hidden'} w-20 h-fit bg-gray-300 rounded-lg overflow-hidden`}>
                        <ul className='text-body font-[400] hover:cursor-pointer text-sm'>
                          <li onClick={() => handleStartReply()} className='hover:bg-amber-600 hover:text-white py-1 pl-2'>Reply</li>
                          <li onClick={() => deleteChatEntry(chatEntryDetails.id, chatEntryDetails.forum)} className='hover:bg-error hover:text-white py-1 pl-2'>Report</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
        :
        chatEntryDetails.type === 'deleted' ?
          <div className={`relative group flex w-full p-2 mb-3 ${isAuthor && `justify-end`} select-none`}>
            <div id={'chatEntry-'+chatEntryDetails.id} className={`group relative opacity-20`}>
              <div className={`flex space-x-2 rounded-xl text-white ${isAuthor && 'flex-row-reverse'}`}>
                {/* profile thumbnail */}
                <div className={`w-8 h-8 overflow-hidden rounded-full ${isAuthor && 'ml-2'}`}>
                  <img src={chatEntryAuthor?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                </div>

                {/* chat content */}
                <div className='relative flex flex-col'>
                  {/* chat body */}
                  <div className='flex flex-col w-fit'>
                    <small className='text-[.55rem] font-bold'><a href={`/user/${chatEntryAuthor?.uid}/profile`}>{chatEntryAuthor?.userName}</a></small>
                    <p className={`text-xs ${isAuthor ? `bg-primary rounded-tr-none` : `rounded-tl-none`} p-2 pl-1 pt-[1px] rounded-lg min-w-[50px] italic`}>Removed</p>
                  </div>
                  {/* extra content */}
                  <div className=' flex justify-between items-center pl-1 opacity-80'>
                    <small className='text-2xs w-fit'>{createdTimestamp}</small>
                  </div>
                  
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
      <hr className='m-auto w-11/12 opacity-10'/>
    </div>
  )
}

export default ChatEntry