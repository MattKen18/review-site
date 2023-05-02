import React, { useEffect, useState } from 'react'
import forumDefaultThumb from '../assets/default-forum-thumbnail.jpg'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { addChatEntryInFirestore, getUserFromFirestore } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Alert } from '@mui/material';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import ChatEntry from './ChatEntry';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const ForumRoom = ({forum}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [alert, setAlert] = useState(null)
  const [chatEntryContent, setChatEntryContent] = useState('')
  const [chat, setChat] = useState([]) // array of firestore chatEntry objects
  const [members, setMembers] = useState({}) // object of user objects
  const [memberIds, setMemberIds] = useState([])
  
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

      if (newForumHeight > 1500) {
        forumRoom.style.height = 1500+'px'
      } else {
        forumRoom.style.height = newForumHeight+'px'
      }
    }

    resizeForum()
    window.addEventListener('resize', resizeForum)

    return () => window.removeEventListener('resize', resizeForum)
  }, [])

  const addChatEntry = (e, type, userId, forumId) => {
    e.preventDefault()
    console.log('clicked')
    addChatEntryInFirestore(chatEntryContent, type, userId, forumId).then(result => {
      if (result) {
        setChatEntryContent('')
      } else {
        setAlert({body: "Error sending message. Please try again.", type: "error"})
      }
    })

  }

  const handleChatEntry = (e) => {
    setChatEntryContent(e.target.value)
  }


  useEffect(() => {
    setTimeout(() => {
      setAlert(null)
    }, 3000);
  }, [alert])

  return (
    <div id={'forum-room'} className='flex flex-col w-full'>
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
      <div className='flex-1 bg-slate-900 w-full overflow-y-scroll p-2'>
        <div className='h-[2000px]'>
          <div className='flex flex-col items-center justify-center mb-10'>
            <p className='font-bold'>Welcome to the Forum!</p>
            <p className='text-xs'>Created on {forum.created.toDate().toDateString()} at {forum.created.toDate().toLocaleTimeString()}</p>
          </div>
          {
            chat.map((chatEntry, key) => (
              <ChatEntry key={chatEntry.id + "entry" + key} chatEntryDetails={chatEntry} forumMembers={members} currentUser={currentUser} />
            ))
          }
        </div>
      </div>

      {/* Input */}
      <div className='flex h-12 p-2 bg-slate-800 text-white'>
        <div className='w-10 flex items-center justify-center'>
          <button type='button' className='active:scale-75 duration-90'>
            <AddOutlinedIcon sx={{ fontSize: 30 }} />
          </button>
        </div>
        <form onSubmit={(e) => addChatEntry(e, 'message', currentUser.uid, forum.id)} className='flex-1 flex'>
          <input 
            value = {chatEntryContent}
            onChange = {(e) => handleChatEntry(e)}
            type="text"
            className='flex-1 rounded-lg outline-none px-2 border-2 border-slate-700 bg-slate-700'
          />
          <button className='w-10'>
            <SendOutlinedIcon sx={{ fontSize: 20 }} />
          </button>
        </form>
        {/* <div className='w-10'>
        </div> */}
      </div>

    </div>
  )
}

export default ForumRoom