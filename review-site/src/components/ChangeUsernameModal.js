import React, { useEffect, useState } from 'react'
import Alert from './Alert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { checkUsernameAvailability, updateUsername } from '../firebase';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';


const ChangeUsernameModal = ({user, close, easyClose}) => {

  const [alert, setAlert] = useState(null)
  const [username, setUsername] = useState('')
  const [usernameRequirements, setUsernameRequirements] = useState({
    unique: false,
    format: false, // underscores, letters, and numbers
  })
  const [validUsername, setValidUsername] = useState(false)

  const auth = getAuth()

  useEffect(() => {
    checkValidUsername()
  }, [username])  
  
  const checkValidUsername = () => {
    
    let usernameRqs = {...usernameRequirements}
  
    const formatRegex = /^[a-zA-Z0-9_]{1,25}$/
    
    if (formatRegex.test(username)) {
      usernameRqs = {...usernameRqs, format: true}
    } else {
      usernameRqs = {...usernameRqs, format: false}
    }
    
    checkUsernameAvailability(username).then(usernameUnique => {
      if (usernameUnique && usernameRqs.format) {
        usernameRqs = {...usernameRqs, unique: true}
      } else {
        usernameRqs = {...usernameRqs, unique: false}
      }
      setUsernameRequirements(usernameRqs)
    })

  }
  
  useEffect(() => {
    setValidUsername(usernameRequirements.unique && usernameRequirements.format)
  }, [usernameRequirements])

  const saveNewUsername = (e) => {
    e.preventDefault()
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          updateProfile(user, {
            displayName: username //updates username of the user created by firebase
          })
        } else {
          // navigate('/login-signup')
        }
      })
      updateUsername(user.uid, username).then(success => {
        if (success) {
          setAlert({body: "Succesfully updated Username!", type: "success"})
          setTimeout(() => {
            close()
          }, 2000)
        }
      }) //updates username of the user we created in firestore 
    }
    catch (e) {
      console.log("Error in updating user's username: ", e)
      setAlert({body: "Error in updating username, please try again", type: "error"})

    }
  }


  return (
    <div className='fixed top-0 bottom-0 z-20 w-screen h-screen flex items-center justify-center'>
      <div onClick={easyClose} className='absolute w-full h-full backdrop-filter backdrop-blur-sm'>
        {
          alert &&
          <Alert content={{body: alert.body, type: alert.type}} />
        }
      </div>
      <div className='relative w-3/12 h-fit rounded-md shadow-2xl bg-white p-10'>
        <h1 className='text-center text-2xl font-bold'>Enter Desired Username</h1>
        <form className='relative mt-10 flex flex-col space-y-4 items-center text-sm' onSubmit={saveNewUsername}>
          <div className='relative w-full'>
            <input 
              className='peer w-full p-2 focus:outline-none border-2 focus:border-emerald-400 rounded-md' 
              type="text" 
              name="" 
              id="new-username"
              placeholder=' '
              value={username}
              onChange={(e) => {setUsername(e.target.value.trim())}}
              autoComplete = "off"
              /> 
            <label 
              htmlFor="new-username"
              className='absolute top-0 left-2 -translate-y-1/2 text-xs opacity-100 peer-placeholder-shown:opacity-70 peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 duration-100 bg-white px-2 hover:cursor-text'
            >
              New Username
            </label>
          </div>
          <div className='w-full'>
            {
              <ul className='list-none text-xs mb-6 font-normal opacity-80'>
                <li className={`${usernameRequirements.unique ? `before:content-['✓_'] text-emerald-400` : `before:content-['x_'] text-slate-500` }`}>Unique Username</li>
                <li className={`${usernameRequirements.format ? `before:content-['✓_'] text-emerald-400` : `before:content-['x_'] text-slate-500` }`}>Only letters, numbers and underscores</li>
              </ul>
            } 
          </div>
          <br />
          <br />
          <button className='w-fit bg-emerald-400 p-2 text-white rounded-sm disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:opacity-80' disabled={!validUsername}>Change Username</button>
        </form>
      </div>
    </div>
  )
}

export default ChangeUsernameModal