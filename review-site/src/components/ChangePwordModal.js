import React, { useEffect, useState } from 'react'
import Alert from './Alert'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ChangePwordModal = ({user, close, easyClose}) => {
  const [alert, setAlert] = useState({})
  const [userEmail, setUserEmail] = useState('')
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setUserEmail(user.email);
    }
  }, [])

  useEffect(() => {
    console.log(userEmail)
  }, [userEmail])

  const sendEmail = () => {
    sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        setAlert({body: "Email sent!", type: 'success'})
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlert({body: errorMessage, type: 'error'})
      });
  }

  return (
    <div className='fixed top-0 bottom-0 z-20 w-screen h-screen flex items-center justify-center'>
      <div onClick={easyClose} className='absolute w-full h-full backdrop-filter backdrop-blur-sm'>
        {
          alert &&
          <Alert content={{body: alert.body, type: alert.type}} />
        }
      </div>
      <div className='relative flex flex-col items-center w-3/12 h-fit rounded-md shadow-2xl bg-white p-10'>
        <h1 className='text-center text-2xl font-bold mb-10'>Change Password</h1>
        <p className='text-center text-sm'>An email will be sent with instructions for changing your password.</p>
        <br />
        <br />
        <button className='w-fit bg-emerald-400 p-2 text-white rounded-sm hover:bg-emerald-300' onClick={sendEmail}>Send Email</button>
      </div>
    </div>
  )
}

export default ChangePwordModal