import React, { useEffect, useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Link } from 'react-router-dom';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { motion } from "framer-motion"
import SingleChatEntry from './SingleChatEntry';
import ReplyingChatEntry from './ReplyingChatEntry';

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

  const getTimestamp = (chatEntry) => {
    const createdTimestamp = null;
    const replyCreatedTimestamp = null;

    const fullTime = chatEntry.created.toDate().toLocaleTimeString().split(':')
    const condensedTime = fullTime.slice(0, 2).join(":") + " " +fullTime[fullTime.length-1].split(' ')[1]
    createdTimestamp = condensedTime

    if (chatEntryDetails.replyingTo) {
      const fullTime = chatEntry.replyingTo.created.toDate().toLocaleTimeString().split(':')
      const condensedTime = fullTime.slice(0, 2).join(":") + " " +fullTime[fullTime.length-1].split(' ')[1]
      replyCreatedTimestamp = condensedTime
    }

    return [createdTimestamp, replyCreatedTimestamp]
  }


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



  const handleShowOptions = () => {
    setOptionsShown(prev => !prev)
  }

  // // handles clicking outside of options menu
  // useEffect(() => {
  //   if ((isAuthor === false || isAuthor) && !['notification', 'deleted'].includes(chatEntryDetails.type)) {
  //     const optionsMenu = document.getElementById('chatEntry-options-menu-'+chatEntryDetails.id)
  //     const chatEntry = document.getElementById('chatEntry-'+chatEntryDetails.id)
  //     // console.log(chatEntry)
  //     // console.log(optionsMenu)
  //     // const optionsButton = document.getElementById('chatEntry-options-button-'+chatEntryDetails.id)
  
      
  //     const handleClickOutside = (e) => {

  //       // const clickedOptionsBtn = e.target === optionsButton || e.target.closest("button") === optionsButton
  //       const clickedOutsideOptions = !optionsMenu.contains(e.target)
  //       const clickedWithinChatEntry = chatEntry.contains(e.target)

  //       // if (clickedWithinChatEntry && clickedOutsideOptions && optionsShown) {
  //       //   e.preventDefault()
  //       //   // setOptionsShown(false)
  //       // }

  //       if (clickedWithinChatEntry && clickedOutsideOptions && optionsShown) {
  //         e.preventDefault()
  //       } else if (!clickedWithinChatEntry) { //if click is outside of the options menu
  //         setOptionsShown(false)
  //       }
  //     }
  
  //     document.addEventListener('click', handleClickOutside)
  
  //     return () => document.removeEventListener('click', handleClickOutside)

  //   }
  // }, [isAuthor, optionsShown])


  // const handleStartEdit = () => {
  //   startEdit(chatEntryDetails, chatEntryAuthor)
  //   setOptionsShown(false)
  // }

  // const handleStartReply = () => {
  //   startReply(chatEntryDetails, chatEntryAuthor)
  //   setOptionsShown(false)
  // }

  // useEffect(() => {

  // }, [])

  return (
    <div className='w-full h-fit'>
      {
        chatEntryDetails.replyingTo ?
        <ReplyingChatEntry />
        :
        <SingleChatEntry 
          chatEntry={{...chatEntryDetails, author: chatEntryAuthor}}
          currentUserOwnsEntry={isAuthor}
          getTimestamp={getTimestamp}
          deleteChatEntry={deleteChatEntry}
        />
      }
      {/* <hr className='m-auto w-11/12 opacity-10'/> */}
    </div>

  )
}

export default ChatEntry