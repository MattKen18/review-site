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


import ImageAddOn from './ImageAddOn';
import AddOnsView from './AddOnsView';
import { chatAddOns, maxAddOns, uploadableAddOns } from '../parameters';

import s3Client from '../s3';


const ForumRoom = ({forum}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [alert, setAlert] = useState(null)
  const [chatEntryContent, setChatEntryContent] = useState('')
  const [chat, setChat] = useState([]) // array of firestore chatEntry objects
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

  const [addOnOption, setAddOnOption] = useState(Object.keys(chatAddOns)[0])

  const [addOns, setAddOns] = useState(chatAddOns) //add-on files
  const [newAddOn, setNewAddOn] = useState(null)
  const [addOnsUploaded, setAddOnsUploaded] = useState(false);

  const [imageSrcs, setImageSrcs] = useState([])

  const chatInputRef = useRef(null)
  const anchorRef = useRef(null)
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
    anchorRef.current.scrollIntoView(false)
  }, [chat])


  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [bottomRef.current]);

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
  
  
  
  const deleteChatEntry = (chatEntryId, forumId) => {
    deleteChatEntryInFirestore(chatEntryId, forumId).then(result => {
      if (result) {
        setAlert({body: "Successfully deleted message", type: "success"})
      } else {
        setAlert({body: "Error deleting message. Please try again.", type: "error"})
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

    if (!emojiPicker.contains(e.target) && !inputForm.contains(e.target)) {
      setEmojiPickerShown(false)
    } else {
      setEmojiPickerShown(true)
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
      console.log(forum.id)
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
    console.log(addOnOption)
    console.log(addOn)
    const addOnsCopy = {...addOns}
    addOnsCopy[type] = addOn
    setAddOns(addOnsCopy)
    console.log('add ons: ', addOnsCopy)
  }

  const uploadFilesToS3 = async (type, files) => {
    for (let i=0; i<files.length; i++) {
      try {
        if (!files[i][2]) { //upload only the files not already uploaded
          const fileName = new Date().toString().split(" ").slice(0, 5).join("-") + '-'+i
          const res = await s3.uploadFile(files[i][0], fileName);
          // files[i][1] = res.location
          // files[i][2] = true //successfully uploaded to s3

          const addOnsCopy = {...addOns}
          addOnsCopy[type][i] = res.location
          setAddOns(addOnsCopy)
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  

  const createChatEntry = (e) => {
    e.preventDefault()
    for (let addOnType in addOns) {
      if (uploadableAddOns.includes(addOnType)) {
        uploadFilesToS3(addOnType, addOns[addOnType])
      }
    }
    setAddOnsUploaded(true)
    setAddOptionsShown(false)
  }

  useEffect(() => {
    console.log("Add Ons: ", addOns)
    if (addOnsUploaded) {
      addChatEntry('message', currentUser.uid, forum.id, addOns)
    }
  }, [addOns, addOnsUploaded])



  return (
    <div id={'forum-room'} className='relative flex flex-col w-full overflow-hidden'>
      {
        alert &&
        <div className='absolute top-0 left-1/2 -translate-x-1/2'>
          <Alert content={{body: alert.body, type: alert.type}} />
        </div>
      }

      {/* Forum Header */}
      <div className='relative flex h-16 bg-slate-200 p-2 pr-20 space-x-4'>
        <div className='w-12 h-12 rounded-lg overflow-hidden'>
          <img src={forumDefaultThumb} alt="forum thumbnail" className='w-full h-full object-cover' />
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex flex-col -space-y-2'>
            <h1 className='font-bold text-xl'>{forum.name}</h1>
            <small className='font-light'>{forum.topic}</small>
          </div>
          <small className='font-bold text-[.55rem]'>Forum Code: {forum.id}</small>
        </div>
        <div className='flex items-center text-sm'>
          <p className=''><QueryBuilderOutlinedIcon /> <span className='text-success'>{forum.lifespan} mins</span></p>
        </div>
        <span className='flex-none absolute top-1/2 -translate-y-1/2 right-5'>X</span>
      </div>

      {/* Chat */}
      <div className='flex-1 bg-slate-900 w-full overflow-y-scroll scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700 scrollbar-rounded-md p-2 mb-12'>
        <div className='relative h-fit px-4'>
          <div className='flex flex-col items-center justify-center mb-10'>
            <p className='font-bold'>Welcome to the Forum!</p>
            <p className='text-xs'>Created on {forum.created.toDate().toDateString()} at {forum.created.toDate().toLocaleTimeString()}</p>
          </div>
          {
            chat.map((chatEntry, key) => (
                <ChatEntry key={chatEntry.id + "entry" + key} 
                  chatEntryDetails={chatEntry}
                  forumMembers={members}
                  currentUser={currentUser}
                  startEdit={startEdit}
                  startReply={startReply}
                  deleteChatEntry={deleteChatEntry}
                  />
              ))
          }
        <div ref={anchorRef} className='absolute bottom-0'></div>
        </div>
      </div>

      {/* Input */}
      <div className='absolute w-full bottom-0 flex text-white'>
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
          {
            addOptionsShown &&
            <div className='absolute -top-44 w-full h-44 border-white'>
              <AddOnsView updater={updateAddOn} stagedImages={addOns['images']} forumId={forum.id}/>
            </div>
          }
        </form>
        {/* <div className='w-10'>
        </div> */}
      </div>

    </div>
  )
}

export default ForumRoom