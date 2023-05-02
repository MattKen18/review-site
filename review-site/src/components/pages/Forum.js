import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { getUserForums, getUserFromFirestore, leaveForumRoom } from '../../firebase'
import Alert from '../Alert'
import CreateForum from '../CreateForum'
import ForumCard from '../ForumCard'
import ForumRoom from '../ForumRoom'
import JoinForum from '../JoinForum'

const Forum = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [forumOption, setForumOption] = useState(null) //join or create forum
  const [userForums, setUserForums] = useState([]) // array of forum objects
  
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
        setUserForums(forums)
      })
    }
  }, [currentUser])


  const addForumToState = (forum) => {
    if (forum) {
      setUserForums([...userForums, forum])
      setActiveForum(forum)
      setForumOption(null)
      setAlert({body: "Forum Created", type: "success"})
    } else {
      setAlert({body: "Error Creating Forum. Please try again", type: "error"})
    }
    
  }

  const joinForum = (forum) => {
    if (forum) {
      const newUserForums = [...userForums, forum]
      
      setAlert({body: "You just joined the forum", type: "success"})
      setUserForums(newUserForums)
      setActiveForum(forum)
      setForumOption(null)

    } else {
      setAlert({body: "Error joining Forum. Please try again", type: "error"})
    }
  }

  const leaveForum = (forum, userId) => {
    leaveForumRoom(forum.id, userId).then(result => {
      if (result) {
        const newUserForums = [...userForums]
        newUserForums.splice(newUserForums.indexOf(forum), 1)

        setUserForums(newUserForums)
        setActiveForum(null)
        setForumOption(null)
        setAlert({body: "You left the forum", type: "success"})
      } else {
        setAlert({body: "Error leaving Forum. Please try again", type: "error"})
      }
    })
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


  // useEffect(() => {
  //   console.log(userForums)
  // }, [userForums])



  return (
    <div className='flex space-x-1'>
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
          
          <div className='px-2 pt-2'>
            {/* <h1 className='py-10 font-extrabold text-xl text-center'>Forums</h1> */}
            <ul>
              {
                userForums.map((forum, key) => (
                  <li key={forum.id+key} className='mb-3'><ForumCard forum={forum} enterForum={enterForum} leaveForum={leaveForum} active={forum === activeForum} /></li>
                ))
              }                
            </ul> 
          </div>

        </div>
      </aside>
      <div className='relative flex-1 min-h-screen bg-gray-100 flex justify-center'>
        {
          alert &&
          <div className='absolute top-0 left-1/2 -translate-x-1/2'>
            <Alert content={{body: alert.body, type: alert.type}} />
          </div>
        }
        {
          activeForum ?
            <>
              <ForumRoom key={activeForum.id} forum={activeForum} />
            </>
          :
          forumOption ?
            forumOption === 'create' ?
              currentUser &&
              <CreateForum user={currentUser} addForumToState={addForumToState} />
            :
            forumOption === 'join' && 
              currentUser &&
              <JoinForum user={currentUser} joinForum={joinForum} />
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