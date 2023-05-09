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

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'




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
  const [cursorTextPosition, setCursorTextPosition] = useState(null)


  const [emoji, setEmoji] = useState([])


  const bottomRef = useRef(null);

  const auth = getAuth()
  
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bottomRef.current]);

  // Realtime listening to changes to forum i.e. new chat messages and members
  useEffect(() => {
    const forumRef = doc(db, 'forums', forum.id)
    const unsubscribe = onSnapshot(forumRef, (updatedForum) => {
      // updatedForum.docChanges()
      setChat(updatedForum.data().chat)
      setMemberIds(updatedForum.data().members)
      // const oldMembers = {...members}
    })





    //   const newMembers = updatedForum.data().members.filter(memberId => !members[memberId])
    //   // console.log("new Members: ", newMembers)
    //   // const members = oldMembers.concat(newMembers)
    //   // setMembers(members)
    //   // console.log(newMembers)

    //   const updatedMembers = {...members}
    //   // console.log(updatedMembers)
      
    //   newMembers.forEach(memberId => {
    //     // console.log(memberId)
    //     getUserFromFirestore(memberId).then(member => {
    //       // console.log(member)
    //       // console.log(Object.keys(updatedMembers))
    //       updatedMembers[memberId] = member
    //       setMembers(updatedMembers)
    //     })
    //   })
    //   console.log(updatedMembers)
    // });

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
    if (members) console.log(members)

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

  const addChatEntry = (e, type, userId, forumId) => {
    e.preventDefault()
    if (forumAction === 'edit') {
      finishEdit(entryBeingEdited)
    }else if (forumAction === 'reply') {
      finishReply(entryBeingRepliedTo)
    } else {
      addChatEntryInFirestore(chatEntryContent, type, userId, forumId).then(result => {
        if (result) {
          setChatEntryContent('')
        } else {
          setAlert({body: "Error sending message. Please try again.", type: "error"})
        }
      })
    }

  }

  const handleChatEntry = (e) => {
    setChatEntryContent(e.target.value)
    setEmoji([null, null])
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


  useEffect(() => {
    // console.log(entryBeingRepliedTo)
  }, [entryBeingRepliedTo])


  useEffect(() => {
    if (forumAction === 'edit') {
    } else if (forumAction === 'reply') {
      
    }
  }, [forumAction])


  // const handleEmojiSelect = (emoji) => {
  //   // let newString = originalString.substring(0, insertIndex) + insertString + originalString.substring(insertIndex);
  //   // console.log("cursor text position from handle emoji: ", cursorTextPosition)
  //   // let newChatContent = chatEntryContent.substring(0, cursorTextPosition) + emoji.emoji + chatEntryContent.substring(cursorTextPosition);
  //   setSelectedEmoji(emoji.emoji)
  //   // setChatEntryContent(newChatContent)
  // }


  const handleInputClick = (e) => {
    setCursorTextPosition(e.target.selectionStart)
    setEmoji([null, null])

  }


  const handleEmojiSelect = (emoji) => {
    const chatInput = document.getElementById('forum-message-input')
    const cursorPos = chatInput.selectionStart

    setEmoji([emoji, cursorPos])
    // setEmoji(prev => {
    //   if (prev == [null, null]) {
    //     [emoji, cursorPos]
    //   } else {
    //     []
    //   }
    // })

    // console.log('last emoji position: ', lastEmojiPos)
    // let newChatContent

    // if (lastEmojiPos !== null) {
    //   newChatContent = chatEntryContent.substring(0, lastEmojiPos) + emoji + chatEntryContent.substring(lastEmojiPos)
    //   // setEmojiPos(lastEmojiPos+1)
    // } else {
    //   newChatContent = chatEntryContent.substring(0, cursorPos) + emoji + chatEntryContent.substring(cursorPos)
    //   // setEmojiPos(cursorPos+1)
    // }

    // setEmoji(lastEmojiPos+1)
    // setChatEntryContent(newChatContent)

  }


  useEffect(() => {
    // const emojiEmpty = emoji.filter(x => x !== null).length === 0
    const chatInput = document.getElementById('forum-message-input')
    const cursorPos = chatInput.selectionStart
    let newChatContent

    if (emoji.length > 0) {
      newChatContent = chatEntryContent.substring(0, emoji[1]) + emoji[0] + chatEntryContent.substring(emoji[1])
    } else {
      newChatContent = chatEntryContent.substring(0, cursorPos) + emoji + chatEntryContent.substring(cursorPos)
    }
  }, [emoji])


  useEffect(() => {
    if (selectedEmoji) {

    }
    setSelectedEmoji(null)

  }, [cursorTextPosition])



  // useEffect(() => {
    
  //   if (selectedEmoji) {
  //     const chatInput = document.getElementById('forum-message-input')
  //     const cursorPos = chatInput.selectionStart
  //     setCursorTextPosition(chatInput.selectionStart)
  //     console.log("cursor text pos: ", chatInput.selectionStart)
  //     if (cursorTextPosition === null) {
  //       setChatEntryContent(chat => chat+selectedEmoji)
  //     } else {
  //       let newChatContent = chatEntryContent.substring(0, cursorPos) + selectedEmoji + chatEntryContent.substring(cursorPos)
  //       setChatEntryContent(newChatContent)
  //     }
  //     // setCursorTextPosition(prevPos => prevPos+1)
  //     setSelectedEmoji(null)
  //   }

  // }, [selectedEmoji])





  useEffect(() => {
    // console.log('current text position: ', cursorTextPosition)
  }, [cursorTextPosition])


  // useEffect(() => {
  //   const input = document.getElementById('forum-message-input')

  //   const handleKeyDown = (e) => {
  //       if (e.key === 'ArrowLeft') {
  //         setCursorTextPosition(prev => prev > 0 ? prev-1 : 0)
  //       } else if (e.key === 'ArrowRight') {
  //         setCursorTextPosition(prev => prev === chatEntryContent.length-1 ? chatEntryContent.length-1 : prev+1)
  //       }
  //   }

  //   input.addEventListener('keydown', handleKeyDown)

  //   return () => input.removeEventListener('keydown', handleKeyDown)
  // }, [chatEntryContent])


  useEffect(() => {
    setTimeout(() => {
      setAlert(null)
    }, 3000);
  }, [alert])

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
        <div className='h-fit min-h-[1000px] px-4'>
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
        </div>
      </div>

      {/* Input */}
      <div className='absolute w-full bottom-0 flex text-white'>
        <form onSubmit={(e) => addChatEntry(e, 'message', currentUser.uid, forum.id)} className='relative flex flex-col flex-1' autoComplete='off' autoCapitalize='sentences'>
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

          <div className='flex space-x-2 h-12 bg-slate-800 p-2 z-[10000]'>
            <div className='flex items-center justify-center'>
              <button type='button' className='active:scale-90 duration-90 rounded-lg hover:bg-gray-900 p-1'>
                <AddOutlinedIcon sx={{ fontSize: 25 }} />
              </button>
            </div>
            <div className='flex items-center space-x-2 flex-1 rounded-lg border-2 border-slate-700 bg-slate-700'>
              <input 
                id='forum-message-input'
                value = {chatEntryContent}
                onChange = {handleChatEntry}
                onClick = {handleInputClick}
                type="text"
                className='flex-1 outline-none bg-inherit px-2'
              />
              <button type='button' onClick={() => setEmojiPickerShown(shown => !shown)} className={`rounded-lg hover:opacity-100 ${emojiPickerShown ? `opacity-100` : `opacity-50`} p-1`}>
               <EmojiEmotionsOutlinedIcon sx={{ fontSize: 25 }} />
              </button>
              {
                emojiPickerShown &&
                <div className={`absolute -top-[29rem] right-10`}>
                      <Picker data={data} onEmojiSelect={emoji => handleEmojiSelect(emoji.native)} />
                  {/* <EmojiPicker height={'23rem'} disableAutoFocus={true} onEmojiClick={handleEmojiSelect} emojiStyle={'native'} /> */}
                </div>
              }
            </div>
            <button className='w-10'>
              <SendOutlinedIcon sx={{ fontSize: 20 }} />
            </button>

          </div>
        </form>
        {/* <div className='w-10'>
        </div> */}
      </div>

    </div>
  )
}

export default ForumRoom