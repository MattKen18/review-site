import React, { useEffect, useState } from 'react'
import forumDefaultThumb from '../assets/default-forum-thumbnail.jpg'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, getForum, getUserForums, getUserFromFirestore } from '../firebase';
import { collection, doc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import { selectForums } from '../slices/userForumsSlice';
import { useSelector } from 'react-redux';

const ForumCard = ({forum, enterForum, leaveForum, active}) => {
  const [userJoined, setUserJoined] = useState(true) //if the user is a member of the forum
  const [optionsShown, setOptionsShown] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [chatSnap, setChatSnap] = useState({}) // the most recent chatEntry
  const [memberIds, setMemberIds] = useState([])

  // const forums = useSelector(selectForums)

  // useEffect(() => {
  //   console.log(forum)
  //   console.log(forums)
  //   for (let forumObj of forums) {
  //     if (Object.keys(forumObj).includes(forum.id)) {
  //       setChatSnap(forumObj[forum.id])
  //       console.log(forumObj)
  //     }
  //   }
  // }, [forums])

  // useEffect(() => {
  //   const checkChat = async () => {
  //     const userForum = await getForum(forum.id)
  //     const chatSnap = {}
  //     chatSnap[forum.id] = {
  //       body: userForum.chat.length ? userForum.chat[userForum.chat.length-1].body : ""
  //     }
  //     console.log(chatSnap)
  //     return chatSnap   
  //   }

  //   const checkChatInterval = setInterval(() => {
  //     // const chatSnap = checkChat()
  //     // setChatSnap(chatSnap)
  //   }, [1000])

  //   return () => clearInterval(checkChatInterval)
  // }, [])

  // const toggleOptionsMenu = () => {
  //   const optionsMenu = document.getElementById('options-menu-'+forum.id)
  //   if (optionsMenu.style.display) {
  //     optionsMenu.style.display = ''
  //     setOptionsShown(false)
  //   } else {
  //     optionsMenu.style.display = 'block'
  //     setOptionsShown(true)
  //   } 
  // }

  useEffect(() => {
    const chat = forum.chat[forum.chat.length-1]
    setChatSnap(chat)
  }, [forum])

  useEffect(() => {
    const q = query(collection(db, 'chatEntries'), where('forum', '==', forum.id), orderBy('created', 'desc'), limit(1))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log(querySnapshot)
      querySnapshot.forEach(doc => {
        console.log(doc.data())
        setChatSnap(doc.data())
      })
      // querySnapshot.docChanges().forEach(change => {
      //   if (change.type === "added") {
      //     console.log(change.doc.data())
      //     setChatSnap(change.doc.data())

      //   }
      // })
    }, (error) => console.log(error))
    return () => unsubscribe()
  }, [])


  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserFromFirestore(user.uid).then(data => {
          // console.log(data)
          setCurrentUser(data)
        })
      }
    })
  }, [])

  const getLastChatEntry = () => {
    const entry = chatSnap ? chatSnap.body : "Start chatting!"
    
    return entry
  }

  useEffect(() => {
    const optionsMenu = document.getElementById('options-menu-'+forum.id)

    if (!optionsShown) {
      optionsMenu.style.display = ''
    } else {
      optionsMenu.style.display = 'block'
    }

  }, [optionsShown])


  useEffect(() => {
    const optionsMenu = document.getElementById('options-menu-'+forum.id)
    const optionsButton = document.getElementById('options-button-'+forum.id)

    
    const handleClickOutside = (e) => {
      const clickedOptionsBtn = e.target === optionsButton || e.target.closest("button") === optionsButton
      const clickedOutside = !optionsMenu.contains(e.target)

      if (clickedOutside && !clickedOptionsBtn) { //if click is outside of the options menu
        setOptionsShown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [])


  return (
    <div className={`group relative w-full border-[1px] rounded-xl h-16 hover:bg-blue-50 ${active && `bg-blue-50`} hover:cursor-pointer`}>
      <div onClick={() => enterForum(forum)} className={`${optionsShown && `blur-[1px]`} relative z-0 flex space-x-2 items-center py-2 px-1 h-full w-full`}>
        <div className='w-1/5 h-full flex items-center justify-center'>
          <div className='h-12 w-12 rounded-lg overflow-hidden'>
            <img src={forum.thumbnail ? forum.thumbnail : forumDefaultThumb} alt="forum thumbnail" className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='flex flex-col flex-1 justify-between'>
          <div className='h-1/5 flex flex-col -space-y-1'>
            <p className='relative z-10 font-bold text-sm w-52 line-clamp-1'>{forum.name}</p>
            <small className='relative z-0 text-[.55rem] w-fit font-light'>{forum.topic}</small>
          </div>
          <div className='flex items-center h-[25px]'>
            {/* most recent chat */}
            <p className='rounded-xl text-[.65rem]'>{getLastChatEntry()}</p>
          </div>
        </div>
      </div>
      <div className='absolute z-10 bottom-2 right-2 w-8 h-8 items-end justify-center rounded-xl '>
        <button id={`${'options-button-'+forum.id}`} onClick={() => setOptionsShown(shown => !shown)} className={`relative hidden group-hover:block z-10 text-[.55rem] w-full h-full rounded-lg hover:bg-gray-200 ${optionsShown && `bg-gray-200`} active:scale-90 duration-100`}>
          <MoreVertOutlinedIcon className='' />
        </button>
        <div id={`${'options-menu-'+forum.id}`} className={`${!optionsShown && `hidden`} absolute bg-gray-200 -bottom-20 right-10 rounded-lg overflow-hidden w-20`}>
          <ul className='text-sm'>
            <li className=' hover:bg-success hover:text-white px-2 py-1'>Enter</li>
            <li className=' hover:bg-primary hover:text-white px-2 py-1'>Details</li>
            <li className=' hover:bg-primary hover:text-white px-2 py-1'>Mute</li>

            {
              userJoined ?
              <li onClick={() => leaveForum(forum, currentUser.uid)} className='hover:bg-error hover:text-white px-2 py-1'>Leave</li>
              :
              <li className='hover:bg-primary hover:text-white px-2 py-1'>Join</li>
            }
          </ul>
        </div>
      </div>
      <span className={`${optionsShown && `blur-[1px]`} absolute flex-none top-1 right-2 text-[.65rem] font-bold text-success`}>{forum.lifespan} mins</span>
    </div>
  )
}

export default ForumCard