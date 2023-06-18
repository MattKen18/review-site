import React, { useEffect, useRef, useState } from 'react'
import Alert from './Alert'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ChangePwordModal = ({user, close, easyClose}) => {
  const [alert, setAlert] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [timeFormatted, setTimeFormatted] = useState("")
  const initiallySet = useRef(null)
  const auth = getAuth();


  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setUserEmail(user.email);
    }
  }, [])

  //load waiting state of password reset from session storage
  useEffect(() => {
    const timeLeft = sessionStorage.getItem('timer')
    if (timeLeft) {
      setTimeRemaining(timeLeft)
      setEmailSent(true)
    } else {
      setTimeRemaining(180000)
    }
  }, [])

  const updateSessionTimer = (timeLeft) => {
    if (!timeLeft) {
      sessionStorage.removeItem('timer')
    } else {
      sessionStorage.setItem('timer', timeLeft)
    }
  }

  const handleTiming = () => {
    const resetTiming = setInterval(() => {
      setTimeRemaining(prev => prev-1000)
    }, 1000)

    setTimeout(() => {
      clearInterval(resetTiming)
    }, timeRemaining)
  }

  useEffect(() => {
    handleTimeRemaining(timeRemaining)
  }, [timeRemaining])

  const handleTimeRemaining = (timeLeft) => {
    const mins = Math.floor(timeLeft/60000)
    const secs = Math.floor((timeLeft%60000)/1000)

    setTimeFormatted(`${mins >= 0 ? mins : 0}:${secs >= 10 ? secs : '0'+secs}`)
  }

  useEffect(() => {
    console.log(userEmail)
  }, [userEmail])

  const sendEmail = () => {
    sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        setAlert({body: "Email sent!", type: 'success'})
        setEmailSent(true)
        handleTiming()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlert({body: errorMessage, type: 'error'})
      });
  }

  return (
    <div className='fixed top-0 bottom-0 z-20 w-screen h-screen flex items-center justify-center'>
      <div onClick={() => {updateSessionTimer(timeRemaining);easyClose()}} className='absolute w-full h-full backdrop-filter backdrop-blur-sm'>
        {
          alert &&
          <Alert content={{body: alert.body, type: alert.type}} />
        }
      </div>
      <div className='relative flex flex-col items-center w-3/12 h-fit rounded-md shadow-2xl bg-white p-10'>
        <h1 className='text-center text-2xl font-bold mb-10'>Change Password</h1>
        {
          !emailSent ?
          <p className='text-center text-sm'>An email will be sent with instructions for changing your password.</p>
          :
          <div className=''>
            <p className='text-center text-sm'>Email Sent. Please check your inbox</p>
            <p className='text-center text-xs mt-4 m-auto'>If you do not see an email you can request another password reset in <span className='text-emerald-400'>{timeFormatted}</span></p>
          </div>
        }
        <br />
        <br />
        <button className='w-fit bg-emerald-400 p-2 text-white rounded-sm hover:bg-emerald-300' onClick={sendEmail}>Send Email</button>
      </div>
    </div>
  )
}

export default ChangePwordModal