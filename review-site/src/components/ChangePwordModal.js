import React, { useEffect, useState } from 'react'
import Alert from './Alert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';


const ChangePwordModal = ({user, close, easyClose}) => {

  const [alert, setAlert] = useState({})
  const [passwordsVisible, setPasswordsVisible] = useState(false)

  useEffect(() => {
    const passwordInputs = document.getElementsByTagName('input')
    console.log(passwordInputs)
    if (passwordsVisible) {
      for (let pword of passwordInputs) {
        pword.type='text'
      }
      // passwordInputs.map(pword => pword.type='text')
    } else {
      for (let pword of passwordInputs) {
        pword.type='password'
      }    }
  }, [passwordsVisible])

  return (
    <div className='fixed top-0 bottom-0 z-20 w-screen h-screen flex items-center justify-center'>
      <div onClick={easyClose} className='absolute w-full h-full backdrop-filter backdrop-blur-sm'>
        {
          alert &&
          <Alert content={{body: alert.body, type: alert.type}} />
        }
      </div>
      <div className='relative w-3/12 h-fit rounded-md shadow-2xl bg-white p-10'>
        <h1 className='text-center text-2xl font-bold'>Change Password</h1>
        <form className='relative mt-10 flex flex-col space-y-4 items-center text-sm'>
          <span className='w-full flex justify-end'>
            {
              passwordsVisible ?
              <VisibilityOutlinedIcon className='hover:cursor-pointer text-emerald-400' onClick={() => setPasswordsVisible(visible => !visible)} />
              :
              <VisibilityOffOutlinedIcon className='hover:cursor-pointer' onClick={() => setPasswordsVisible(visible => !visible)} />

            }
          </span>
          <div className='relative w-full'>
            <input 
              className='peer w-full p-2 focus:outline-none border-2 focus:border-emerald-400 rounded-md' 
              type="password" 
              name="" 
              id="old-pword"
              placeholder=' '
            />
            <label 
              htmlFor="old-pword"
              className='absolute top-0 left-2 -translate-y-1/2 text-xs opacity-100 peer-placeholder-shown:opacity-70 peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 duration-100 bg-white px-2'
            >
              Old Password
            </label>
          </div>
          <div className='relative w-full'>
            <input 
              className='peer w-full p-2 focus:outline-none border-2 focus:border-emerald-400 rounded-md' 
              type="password" 
              name="" 
              id="new-pword"
              placeholder=' '
            />
            <label 
              htmlFor="new-pword"
              className='absolute top-0 left-2 -translate-y-1/2 text-xs opacity-100 peer-placeholder-shown:opacity-70 peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 duration-100 bg-white px-2'
            >
              New Password
            </label>
          </div>
          <div className='relative w-full'>
            <input 
              className='peer w-full p-2 focus:outline-none border-2 focus:border-emerald-400 rounded-md' 
              type="password" 
              name="" 
              id="new-pword2"
              placeholder=' '
            />
            <label 
              htmlFor="new-pword2"
              className='absolute top-0 left-2 -translate-y-1/2 text-xs opacity-100 peer-placeholder-shown:opacity-70 peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 duration-100 bg-white px-2'
            >
              New Password Again
            </label>
          </div>
          <br />
          <br />
          <button className='w-fit bg-emerald-400 p-2 text-white rounded-sm hover:bg-emerald-300'>Change Password</button>
        </form>
      </div>
    </div>
  )
}

export default ChangePwordModal