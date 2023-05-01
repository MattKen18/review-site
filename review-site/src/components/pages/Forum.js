import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { getUserForums, getUserFromFirestore } from '../../firebase'
import Alert from '../Alert'
import CreateForum from '../CreateForum'
import ForumRoom from '../ForumRoom'
import JoinForum from '../JoinForum'

const Forum = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [forumOption, setForumOption] = useState(null) //join or create forum
  const [activeUserForums, setActiveUserForums] = useState([])
  
  const [activeForum, setActiveForum] = useState(null) //forum object
  
  const [alert, setAlert] = useState(null)
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


  useEffect(() => {
    if (currentUser) {
      getUserForums(currentUser.uid).then(forums => {
        // console.log('forums: ', forums)
        setActiveUserForums(forums)
      })
    }
  }, [currentUser])


  const addForumToState = (forumId) => {
    if (forumId) {
      setActiveUserForums([...activeUserForums, forumId])
      setActiveForum(forumId)
      setForumOption(null)
      setAlert({body: "Forum Created", type: "success"})
    } else {
      setAlert({body: "Error Creating Forum. Please try again", type: "error"})
    }
    
  }
  
  
  useEffect(() => {
    
  }, [activeForum])
  
    
  const changeForumOption = (option) => {
    setForumOption(option)
    setActiveForum(null)
  }


  const enterForum = (forum) => {
    setActiveForum(forum)
  }


  useEffect(() => {
    setTimeout(() => {
      setAlert(null)
    }, 3000);
  }, [alert])


  useEffect(() => {
    console.log(activeUserForums)
  }, [activeUserForums])



  return (
    <div className='flex'>
      <aside className='h-screen basis-1/4'>
        <div className='h-screen border-r-2 border-slate-200 fixed w-[20.9%] select-none bg-white'>
          <div className='flex space-x-2 h-16 text-white bg-slate-100 p-2'>
            <button role='button' 
              className='w-1/2 h-full bg-pink-600 hover:opacity-80 rounded-md active:translate-y-1 duration-100'
              onClick={() => changeForumOption('create')}
              >Create</button>
            <button role='button' 
              className='w-1/2 h-full bg-blue-600 hover:opacity-80 rounded-md active:translate-y-1 duration-100'
              onClick={() => changeForumOption('join')}
              >Join</button>
          </div>
          
          <div className='px-2'>
            <h1 className='py-10 font-extrabold text-xl'>Forums</h1>
            <ul>
              {
                activeUserForums.map((forum, key) => (
                  <li key={key} onClick={() => enterForum(forum)}>{forum.id}</li>
                ))
              }                
            </ul> 
          </div>

        </div>
      </aside>
      <div className='relative flex-1 min-h-screen bg-gray-100 flex justify-center pt-10'>
        {
          alert &&
          <div className='absolute top-0 left-1/2 -translate-x-1/2'>
            <Alert content={{body: alert.body, type: alert.type}} />
          </div>
        }
        {
          activeForum ?
            <div>
              <ForumRoom forum={activeForum} />
            </div>
          :
          forumOption ?
            forumOption === 'create' ?
              currentUser &&
              <CreateForum user={currentUser} addForumToState={addForumToState} />
            :
            forumOption === 'join' && 
              currentUser &&
              <JoinForum user={currentUser} />
          :
          <div>
            <h1>No forum selected</h1>
          </div>
        }
      </div>
    </div>
  )
}

export default Forum