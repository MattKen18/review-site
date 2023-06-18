import React, { useEffect, useRef, useState } from 'react'
import forumDefaultThumb from '../assets/default-forum-thumbnail.jpg'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { addChatEntryInFirestore, deleteChatEntryInFirestore, editChatEntryInFirestore, getUserFromFirestore } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Alert } from '@mui/material';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import ChatEntry from './ChatEntry';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ContentEditable from 'react-contenteditable'
import TextareaAutosize from 'react-textarea-autosize';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

import ImageAddOn from './ImageAddOn';
import AddOnsView from './AddOnsView';
import { chatAddOns, maxAddOns, uploadableAddOns } from '../parameters';

import s3Client from '../s3';
import { useDispatch } from 'react-redux';
import { addAlert } from '../slices/alertSlice';

import { motion } from 'framer-motion';
import ForumPanelPopUp from './ForumPanelPopUp';


const ForumRoom = ({forum}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [alert, setAlert] = useState(null)
  const [chatEntryContent, setChatEntryContent] = useState('')
  const [chat, setChat] = useState([]) // array of firestore chatEntry objects
  const [aggregatedChat, setAggregatedChat] = useState([]) // array of joined chat entries
  const [members, setMembers] = useState({}) // object of user objects
  const [memberIds, setMemberIds] = useState([])
  
  const [forumAction, setForumAction] = useState(null) //if user is editing message or replying to message
  const [entryBeingEdited, setEntryBeingEdited] = useState(null)
  const [entryBeingRepliedTo, setEntryBeingRepliedTo] = useState(null)
  
  const [emojiPickerShown, setEmojiPickerShown] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  
  const [emojiSelecting, setEmojiSelecting] = useState(false)
  
  const [addOptionsShown, setAddOptionsShown] = useState(false)
  const [popUpPanelShown, setPopUpPanelShown] = useState(false)

  const [addOnOption, setAddOnOption] = useState(Object.keys(chatAddOns)[0])
  
  const [addOns, setAddOns] = useState(chatAddOns) //add-on files
  const [newAddOn, setNewAddOn] = useState(null)
  const [addOnsUploaded, setAddOnsUploaded] = useState(false);

  const [imageSrcs, setImageSrcs] = useState([])
  
  const [scrollingUp, setScrollingUp] = useState(false)
  const [prevScrollTop, setPrevScrollTop] = useState(0)
  const [atBottom, setAtBottom] = useState(true)
  const [seeking, setSeeking] = useState(false) //if user scroll within the chat

  const chatInputRef = useRef(null)
  const chatRef = useRef(null)
  const chatFormRef = useRef(null)
  const emojiPickerRef = useRef(null)
  
  
  const auth = getAuth()

  const config = {
    bucketName: 'test-image-store-weviews',
    dirName: 'forums/'+forum.id, 
    region: 'us-east-2',
    accessKeyId: 'AKIAR74LVHA4ZCOAF7OT',
    secretAccessKey: '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',
  }
  
  const dispatch = useDispatch()
  
  const s3 = s3Client(config)
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserFromFirestore(user.uid).then(data => {
          setCurrentUser(data)
        })
      }
    })
  }, [])

  useEffect(() => {
    if (!seeking) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chat, aggregatedChat, seeking])


  // handles stopping automatic scrolling to bottom when user is scrolling
  useEffect(() => {
    if (chatRef.current) {
      const handleScrollStop = () => {
        const currentScrollTop = chatRef.current.scrollTop
        const scrollHeight = chatRef.current.scrollHeight;
        const clientHeight = chatRef.current.clientHeight;

        // Calculate the maximum scrollable value
        const maxScroll = scrollHeight - clientHeight;

        if (currentScrollTop >= maxScroll-10) { // add a 10 px threshold
          setSeeking(false)
        } else {
          setSeeking(true)
        }
      }
      chatRef.current.addEventListener('scroll', handleScrollStop)
  
      return () => window.removeEventListener('scroll', handleScrollStop)
    }
  }, [chatRef.current, prevScrollTop])


  // Realtime listening to changes to forum i.e. new chat messages and members
  useEffect(() => {
    const forumRef = doc(db, 'forums', forum.id)
    const unsubscribe = onSnapshot(forumRef, (updatedForum) => {
      // updatedForum.docChanges()
      setChat(updatedForum.data().chat)
      setMemberIds(updatedForum.data().members)
      // const oldMembers = {...members}
    })
    return () => unsubscribe()
  }, [])


  useEffect(() => {

    try {
      if (memberIds < Object.keys(members)) { // members left the forum
        const membersThatLeft = Object.keys(members).filter(memberId => !memberIds.includes(memberId))
        const updatedMembers = {...members}
          // console.log(updatedMembers)
          
        membersThatLeft.forEach(memberId => {
          delete updatedMembers[memberId]
          setMembers(updatedMembers)
        })
  
      } else {
        const newMembers = memberIds.filter(memberId => !members[memberId])
        const updatedMembers = {...members}
          // console.log(updatedMembers)
          
        newMembers.forEach(memberId => {
          // console.log(memberId)
          getUserFromFirestore(memberId).then(member => {
            // console.log(member)
            // console.log(Object.keys(updatedMembers))
            updatedMembers[memberId] = member
            setMembers(updatedMembers)
          })
        })
      }
    } catch (e) {
      console.log(e)
    }

    }, [memberIds])
    
  useEffect(() => {
    // if (members) console.log(Object.keys(members))
    // if (members) console.log(members)

  }, [members])

  useEffect(() => {
    const resizeForum = () => {
      const headerHeight = window.getComputedStyle(document.getElementById('header')).getPropertyValue('height')
      const forumRoom = document.getElementById('forum-room')
  
      const newForumHeight = window.innerHeight - headerHeight.slice(0, headerHeight.length-2)
      forumRoom.style.height = newForumHeight+'px'
    }

    resizeForum()
    window.addEventListener('resize', resizeForum)

    return () => window.removeEventListener('resize', resizeForum)
  }, [])


  const addChatEntry = (type, userId, forumId, currentAddOns) => {
    setEmojiPickerShown(false)
    if (forumAction === 'edit') {
      finishEdit(entryBeingEdited)
    }else if (forumAction === 'reply') {
      finishReply(entryBeingRepliedTo)
    } else {
      addChatEntryInFirestore(chatEntryContent, type, userId, forumId, null, currentAddOns).then(result => {
        if (result) {
          setChatEntryContent('')
        } else {
          setAlert({body: "Error sending message. Please try again.", type: "error"})
        }
      })
    }

  }
  
  
  
  const deleteChatEntry = (chatEntryId, forumId=forum.id) => {
    deleteChatEntryInFirestore(chatEntryId, forumId).then(result => {
      if (result) {
        dispatch(addAlert({body: "Message deleted", type: "error"}))
      } else {
        dispatch(addAlert({body: "Error deleting message. Please try again.", type: "error"}))
      }
      })
  }


  const startEdit = (chatEntry, entryAuthor) => {
    const chatInput = document.getElementById('forum-message-input')
    setForumAction('edit')
    
    const chatEntryWithAuthor = {...chatEntry}
    chatEntryWithAuthor.author = entryAuthor
    
    setEntryBeingEdited(chatEntryWithAuthor)
    
    setChatEntryContent(chatEntry.body)
    chatInput.focus()
  }
    
    
  const finishEdit = (chatEntry) => {
    editChatEntryInFirestore(chatEntry.id, forum.id, chatEntryContent).then(result => {
      if (result) {
        setAlert({body: "Successfully deleted message", type: "success"})
        setChatEntryContent('')
        setForumAction(null)
        setEntryBeingEdited(null)
      } else {
        setAlert({body: "Error deleting message. Please try again.", type: "error"})
      }
    })
  }
    
  const finishReply = () => {
    addChatEntryInFirestore(chatEntryContent, 'message', currentUser.uid, forum.id, entryBeingRepliedTo).then(result => {
      if (result) {
        setForumAction(null)
        setChatEntryContent('')
        setEntryBeingRepliedTo(null)
      } else {
        setAlert({body: "Error deleting message. Please try again.", type: "error"})
      }
    })
  }
  
  const cancelReply = () => {
    setForumAction(null)
    setChatEntryContent('')
    setEntryBeingRepliedTo(null)
  }
  
  const cancelEdit = () => {
    setForumAction(null)
    setChatEntryContent('')
    setEntryBeingEdited(null)
  }
  
  const startReply = (chatEntry, entryAuthor) => {
    const chatInput = document.getElementById('forum-message-input')
    
    setForumAction('reply')
    
    const chatEntryWithAuthor = {...chatEntry}
    chatEntryWithAuthor.author = entryAuthor
    setEntryBeingRepliedTo(chatEntryWithAuthor)
    
    setChatEntryContent('')
    chatInput.focus()
    
  }
  
  const handleOutsideEmojiClick = (e) => {
    const emojiPicker = emojiPickerRef.current
    const inputField = chatInputRef.current
    const inputForm = chatFormRef.current
    // const emojiToggleBtn = document.getElementById('emojiPickerToggle')

    try {
      if (!emojiPicker.contains(e.target) && !inputForm.contains(e.target)) {
        setEmojiPickerShown(false)
      } else {
        setEmojiPickerShown(true)
      }
    } catch (e) {
      console.log(e)
    }
    
  }
  
  useEffect(() => {

    if (emojiPickerShown) {
      document.addEventListener('click', handleOutsideEmojiClick)
      return () => document.removeEventListener('click', handleOutsideEmojiClick)
    }

  }, [emojiPickerShown])


  useEffect(() => {
    const handleInputNavigations = e => {
      // console.log(forum.id)
      if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {

        setCursorPosition(chatInputRef.current.selectionStart)
        setSelectedEmoji(null)
      } else if (e.keyCode === 13) {
        e.preventDefault()
        document.getElementById('chat-input-submit-btn').click()
      }
    }
    
    const handleInputClick = e => {
      setCursorPosition(chatInputRef.current.selectionStart)

      setSelectedEmoji(null)
    }
    
    const handleInputBlur = e => {
      setCursorPosition(chatInputRef.current.selectionStart)

    }

    if (chatInputRef.current) {
      
      chatInputRef.current.addEventListener('keydown', handleInputNavigations)
      chatInputRef.current.addEventListener('click', handleInputClick)
      chatInputRef.current.addEventListener('blur', handleInputBlur)
      
    }

    
    return () => {
      if (chatInputRef.current) {
        chatInputRef.current.removeEventListener('keydown', handleInputNavigations)
        chatInputRef.current.removeEventListener('click', handleInputClick)
        chatInputRef.current.removeEventListener('blur', handleInputBlur)
      }
    }
    
    
  }, [chatInputRef.current])


  const handleTextChatEntry = (chatEntry) => {
    
    setChatEntryContent(chatEntry)
    setCursorPosition(chatInputRef.current.selectionStart)

    setEmojiSelecting(false)
  }


  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji)
  }


  const convertEmoji = (emoji) => {
    return String.fromCodePoint(parseInt(emoji.unified, 16))
  }

  useEffect(() => {
    if (selectedEmoji) {
      const newChatEntry = chatEntryContent?.substring(0, cursorPosition) + convertEmoji(selectedEmoji) + chatEntryContent.substring(cursorPosition)
      setChatEntryContent(newChatEntry)
      setCursorPosition(prev => prev+2)
    }
  }, [selectedEmoji])

  const setChatAddOn = (addOnType) => {
      setAddOnOption(addOnType)
  }

  useEffect(() => {
    setTimeout(() => {
      setAlert(null)
    }, 3000);
  }, [alert])

  const updateAddOn = (addOn=[], type=addOnOption) => {
    // console.log(addOnOption)
    // console.log(addOn)
    const addOnsCopy = {...addOns}
    addOnsCopy[type] = addOn
    setAddOns(addOnsCopy)
    // console.log('add ons: ', addOnsCopy)
  }

  const uploadFilesToS3 = async (type, files) => {
    for (let i=0; i<files.length; i++) {
      try {
        if (!files[i][2]) { //upload only the files not already uploaded
          const fileName = new Date().toString().split(" ").slice(0, 5).join("-") + '-'+i
          const res = await s3.uploadFile(files[i][0], fileName);

          const addOnsCopy = {...addOns}
          addOnsCopy[type][i] = res.location
          addChatEntry('message', currentUser.uid, forum.id, addOnsCopy)
          resetAddOns()
          return true
        }
      } catch (exception) {
        console.log(exception);
        return false
      }
    }
  }
  

  const createChatEntry = (e) => {
    e.preventDefault()
    for (let addOnType in addOns) {
      if (uploadableAddOns.includes(addOnType) && addOns[addOnType].length) {
        uploadFilesToS3(addOnType, addOns[addOnType])
        .then((success) => {
          setAddOnsUploaded(true)
          setAddOptionsShown(false)
        })
        .catch(error => console.log(error))
        return
      }
    }
    addChatEntry('message', currentUser.uid, forum.id, addOns)
    resetAddOns()
    return

  }

  const resetAddOns = () => {
    setAddOns(chatAddOns)
  }

  // useEffect(() => {
  //   console.log("Add Ons: ", addOns)
  //   if (addOnsUploaded) {
  //     addChatEntry('message', currentUser.uid, forum.id, addOns)
  //     // setAddOnsUploaded(false)
  //   }
  // }, [addOns, addOnsUploaded])

  const getTimestamp = (chatEntry) => {
    let createdTimestamp = null;
    let replyCreatedTimestamp = null;

    const fullTime = chatEntry.created.toDate().toLocaleTimeString().split(':')
    const condensedTime = fullTime.slice(0, 2).join(":") + " " +fullTime[fullTime.length-1].split(' ')[1]
    createdTimestamp = condensedTime

    if (chatEntry.replyingTo) {
      const fullTime = chatEntry.replyingTo.created.toDate().toLocaleTimeString().split(':')
      const condensedTime = fullTime.slice(0, 2).join(":") + " " +fullTime[fullTime.length-1].split(' ')[1]
      replyCreatedTimestamp = condensedTime
    }

    return [createdTimestamp, replyCreatedTimestamp]
  }

  // TODO: add support for transferring addons to aggregated chat entry
  //       look into using useMemo
    
  // groups sequential chat entries from the same author
  const chatGrouper = (chatEntry, chat, count=0) => {
    if (chat.length) {
      if (chat[0].user !== chatEntry.user) {
        return [chatEntry, chat, count]
      } 
      // updates each entry in the aggregated chat entry's lines with it's created timestamp 
      chat[0].timestamp = getTimestamp(chat[0])[0]

      return chatGrouper({...chatEntry, lines: [...chatEntry.lines, chat[0]]}, chat.slice(1), count++)
    }
    return [chatEntry, chat, count]
  }

  useEffect(() => {
    if (chat.length) {
      let [firstAggregatedChatEntry, currentChat] = chatGrouper({...chat[0], lines: []}, chat) 
      const newAggregatedChat = [firstAggregatedChatEntry]

      while (currentChat.length) {
        const [aggregatedChatEntry, restOfChat] = chatGrouper({...currentChat[0], lines: []}, currentChat, 0)
        currentChat = [...restOfChat]
        newAggregatedChat.push(aggregatedChatEntry)
      }
      
      setAggregatedChat(newAggregatedChat)
    }
  }, [chat])


  // useEffect(() => {
  //   dispatch(addAlert({body: "Successfully loaded!", type: "success"}))
  // }, [])
  

  return (
    <div id={'forum-room'} className='relative flex flex-col w-full overflow-hidden'>
      {
        alert &&
        <motion.div className='absolute top-0 left-1/2 -translate-x-1/2'>
          <Alert content={{body: alert.body, type: alert.type}} />
        </motion.div>
      }

      {/* Forum Header */}
      <div className='relative flex flex-row items-center h-20 bg-slate-800 p-2 space-x-4 text-light-text'>
       
        {/* title and topic */}
        <div className='w-16 h-16 rounded-lg overflow-hidden'>
          <img src={forumDefaultThumb} alt="forum thumbnail" className='w-full h-full object-cover' />
        </div>
        <div className='flex flex-col flex-1 h-full'>
          <h1 className='font-bold text-lg'>{forum.name}</h1>
          <p className='text-xs leading-3 font-light border-l-4 border-highlight pl-1 mb-1 italic'>{forum.topic}</p>
          <div className=''>
            <small className='leading-3 text-xs font-bold'>Forum code: <span className='text-highlight px-1 bg-secondary rounded-md'>{forum.id}</span></small>
          </div>
        </div>

        {/* member count and timing */}
        <motion.button 
          onClick={() => setPopUpPanelShown(shown => !shown)}
          type='button'
          className='flex flex-col items-center text-sm font-bold p-2 rounded-md bg-primary text-white'
          whileTap={{
            scale: 0.8,
          }}
          >
          <div className='flex w-full flex-row items-center space-x-2'>
            <GroupsOutlinedIcon />
            <p>{forum.members.length}</p>
          </div>
          <div className='flex flex-row items-center space-x-2'>
            <QueryBuilderOutlinedIcon />  
            <span className=''>{forum.lifespan}</span>
          </div>
        </motion.button>
      </div>

      {/* Chat */}
      <div ref={chatRef} className='relative flex-1 bg-slate-900 w-full overflow-y-scroll scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700 scrollbar-rounded-md p-2 max-h-full'>
        <div className='relative h-fit px-4'>
          <div className='flex flex-col items-center justify-center mb-10'>
            <p className='font-bold'>Welcome to the Forum!</p>
            <p className='text-xs'>Created on {forum.created.toDate().toDateString()} at {forum.created.toDate().toLocaleTimeString()}</p>
          </div>
          {
            popUpPanelShown && 
            <div className='absolute w-1/4 h-full top-0 right-0 rounded-md'>
              <div className='w-full h-fit sticky top-0 right-0 z-[100]'>
                <ForumPanelPopUp forum={forum} />
              </div>

            </div>
          }
          {/* chat container */}
          <div className='flex flex-col space-y-3'>
            {
              aggregatedChat.map((chatEntry, key) => (
                  <> 
                    <ChatEntry key={chatEntry.id + "entry" + key} 
                      chatEntryDetails={chatEntry}
                      forumMembers={members}
                      currentUser={currentUser}
                      startEdit={startEdit}
                      startReply={startReply}
                      deleteChatEntry={deleteChatEntry}
                      className={'h-fit'}
                    />
                    <hr className='bg-slate-200 w-[90%] m-auto opacity-20' />
                  </>
                ))
            }
          </div>
          <br />
        </div>
      </div>
      {
        seeking &&
        <motion.div 
          className={`absolute z-[1000] flex items-center justify-center px-2 py-1 ${addOptionsShown ? `right-10 bottom-72` : `right-10 bottom-20`} bg-primary text-white rounded-md`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 0,
          }}
          >
          <button type='button' className='group w-full' onClick={() => setSeeking(false)}>
            <span className='group-hover:hidden flex flex-row items-center justify-center space-x-2'>
              <PauseCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} />
            </span>
            <span className='hidden group-hover:flex flex-row items-center justify-center space-x-2'>
              <ArrowDownwardOutlinedIcon sx={{ fontSize: 20 }} />
            </span>
          </button>
        </motion.div>

      }

      {/* Input */}
      <div className='sticky w-full bottom-0 flex flex-col text-white'>
        {
          addOptionsShown &&
          <div className='w-full border-white'>
            <AddOnsView updater={updateAddOn} stagedImages={addOns['images']} forumId={forum.id}/>
          </div>
        }  
        <form ref={chatFormRef} onSubmit={createChatEntry} className='relative flex flex-col flex-1' autoComplete='off' autoCapitalize='sentences'>
          {
            entryBeingRepliedTo && forumAction === 'reply' ?

            <div className={`relative h-fit p-2 mb-2 backdrop-blur-md w-fit min-w-[200px] mx-12 text-white border-l-4 border-l-amber-700`}>
              <p className='font-bold text-sm'>Replying to: </p>
              <div className={`relative group flex w-full p-2 mb-3`}>

                {/* chatEntry Content */}
                <div className={`group relative`}>
                  <div className={`flex space-x-2 rounded-xl text-white`}>
                    {/* profile thumbnail */}
                    <div className='w-8 h-8 overflow-hidden rounded-full'>
                      <img src={entryBeingRepliedTo?.author?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                    </div>

                    {/* chat content */}
                    <div className='relative flex flex-col'>
                      {/* chat body */}
                      <div className='flex flex-col w-fit'>
                        <small className='text-[.55rem] font-bold'><a href={`/user/${entryBeingRepliedTo?.uid}/profile`}>{entryBeingRepliedTo?.author?.userName}</a></small>
                        <p className={`${currentUser.uid === entryBeingRepliedTo?.author?.uid ? `bg-primary` : `bg-slate-700` }  p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[30px]`}>{entryBeingRepliedTo.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type='button' onClick={() => cancelReply()} className='absolute top-0 right-0'>
                <CloseOutlinedIcon />
              </button>
            </div>
            :
            entryBeingEdited && forumAction === 'edit' &&
            <div className={`relative h-fit p-2 mb-2 backdrop-blur-md w-fit min-w-[200px] mx-12 text-white border-l-4 border-l-green-700`}>
            <p className='font-bold text-sm'>Editing: </p>
            <div className={`relative group flex w-full p-2 mb-3`}>

              {/* chatEntry Content */}
              <div className={`group relative`}>
                <div className={`flex space-x-2 rounded-xl text-white`}>
                  {/* profile thumbnail */}
                  <div className='w-8 h-8 overflow-hidden rounded-full'>
                    <img src={entryBeingEdited?.author?.photoURL} alt="user profile picture" className='w-full h-full object-cover' />
                  </div>

                  {/* chat content */}
                  <div className='relative flex flex-col'>
                    {/* chat body */}
                    <div className='flex flex-col w-fit'>
                      <small className='text-[.55rem] font-bold'><a href={`/user/${entryBeingEdited?.uid}/profile`}>{entryBeingEdited?.author?.userName}</a></small>
                      <p className={`${currentUser.uid === entryBeingEdited?.author?.uid ? `bg-primary` : `bg-slate-700` }  p-2 pl-1 pt-[1px] rounded-lg rounded-tl-none min-w-[30px]`}>{chatEntryContent}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type='button' onClick={() => cancelEdit()} className='absolute top-0 right-0'>
              <CloseOutlinedIcon />
            </button>
            </div>
          }

          {/* Chat Input Form */}
          <div className='flex space-x-2 min-h-12 bg-slate-800 p-2 z-[10000]'>
            <div className='flex items-center justify-center'>
              <button onClick={() => {setAddOptionsShown(shown => !shown); setEmojiPickerShown(false)}} type='button' className={`active:scale-90 duration-90 rounded-lg ${addOptionsShown && `bg-gray-900`} hover:bg-gray-900 p-1`}>
                <AddOutlinedIcon sx={{ fontSize: 25 }} />
              </button>
            </div>
            <div className='flex items-center space-x-2 flex-1 h-fit rounded-lg border-2 border-slate-700 bg-slate-700'>
              <TextareaAutosize 
                maxRows={4}
                id='forum-message-input'
                ref={chatInputRef}
                value={chatEntryContent}
                onChange={(e) => handleTextChatEntry(e.target.value)}
                className='flex-1 outline-none bg-inherit px-2 resize-none'
              />
              <button type='button' id='emojiPickerToggle' onClick={() => setEmojiPickerShown(shown => !shown)} className={`rounded-lg hover:opacity-100 ${emojiPickerShown ? `opacity-100` : `opacity-50`} p-1`}>
               <EmojiEmotionsOutlinedIcon sx={{ fontSize: 25 }} />
              </button>
              {
                emojiPickerShown &&
                <div ref={emojiPickerRef} id='emoji-picker' className={`absolute -top-[29rem] right-10 ${emojiSelecting && `pointer-events-none`}`}>
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} previewPosition={'none'}  skinTonePosition={'none'} />
                  {/* <EmojiPicker height={'23rem'} disableAutoFocus={true} onEmojiClick={handleEmojiSelect} emojiStyle={'native'} /> */}
                </div>
              }
            </div>
            <button className='w-10' id='chat-input-submit-btn'>
              <SendOutlinedIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default ForumRoom