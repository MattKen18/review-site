import React, { useEffect, useState } from 'react'
import AdSpace from '../AdSpace'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { addUserToFirestore } from '../../firebase';
import Alert from '../Alert';



const LoginSignup = () => {
  const [method, setMethod] = useState('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [validUsername, setValidUsername] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false, //atleast 8 characters long no spaces
    cases: false,
    numbers: false,
    specials: false,
  })
  const [validPassword, setValidPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  
  const [alert, setAlert] = useState('')

  const auth = getAuth()
  const navigate = useNavigate();

  const checkPasswordMatch = () => {
    // console.log(e.target.value === password)
    if (password2 === password1) {
      setPasswordMatch(true)
    } else {
      setPasswordMatch(false)
    }
  }

  const checkValidEmail = () => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    setValidEmail(emailRegex.test(email))
  }

  const checkValidUsername = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{1,}$/
    setValidUsername(usernameRegex.test(username))
  }

  const checkValidPassword = () => {
    const lengthRegex = /^.{8,}$/
    const casesRegex = /(?=.*[a-z])(?=.*[A-Z])/
    const numberRegex = /(?=.*\d)/;
    const specialsRegex = /(?=.*[^\w\d])/;


    let requirements = {...passwordRequirements}

    //check length
    if (lengthRegex.test(password1)) {
      requirements = {...requirements, length: true}
    } else {
      requirements = {...requirements, length: false}
    }
    
    // check upper and lower case
    if (casesRegex.test(password1)) {
      requirements = {...requirements, cases: true}
    } else {
      requirements = {...requirements, cases: false}
    }

    // check for numbers
    if (numberRegex.test(password1)) {
      requirements = {...requirements, numbers: true}
    } else {
      requirements = {...requirements, numbers: false}
    }

   // check for special characters
    if (specialsRegex.test(password1)) {
      requirements = {...requirements, specials: true}
    } else {
      requirements = {...requirements, specials: false}
    }

    setPasswordRequirements(requirements)
  }

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  useEffect(() => {
    const password = document.getElementById('password1')

    if (passwordVisible) {
      password.type = 'text'
    } else {
      password.type = 'password'
    }

  }, [passwordVisible])

  useEffect(() => {
    for (let validator in passwordRequirements) {
      if (!passwordRequirements[validator]) {
        setValidPassword(false)
        return
      }
    }
    setValidPassword(true)
  }, [passwordRequirements])

  useEffect(() => {
    checkValidEmail()
  }, [email])
  
  useEffect(() => {
    checkValidUsername()
  }, [username])
  
  useEffect(() => {
    checkValidPassword()
  }, [password1])

  useEffect(() => {
    checkPasswordMatch()
  }, [password2])


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTimeout(() => {
          navigate('/')
        }, 3000);
      } else {
        // navigate('/login-signup')
      }
    })
  }, [])

  const createUser = (e) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email, password1)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: username, //photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(() => {
        addUserToFirestore(user)
      }).catch((error) => {
        console.log(error)
      });
      console.log(user)
      setAlert({body: "Welcome to Weviews!", type: "inform"})
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ": " + errorMessage)
    })
  } 


  const signInUser = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password1)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setAlert({body: "Succesfully Logged In", type: "inform"})
      document.getElementById("submit-btn").disabled = true
      console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      if (errorCode === 'auth/too-many-requests') {
        setAlert({body: "Too many requests have been made, the account is temporarily locked. Please try again in a little while", type: "error"})
      } else if (errorCode === 'auth/wrong-password') {
        setAlert({body: "Incorrect password, Please try again", type: "error"})
      } else {
        setAlert({body: "User does not exist", type: "error"})
      }
    });

    setTimeout(() => {
      setAlert(null)
    }, (3000));
  }

  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div className='flex-1 bg-gray-100'>
        <div className='min-h-10 h-10 mb-3'>
          {
            alert &&
            <Alert content={{body: alert.body, type: alert.type}} />
          }
        </div>
        <div className='mb-10'>
          <h1 className='text-center font-bold text-3xl'>{method === 'signup' ? 'Sign Up' : 'Login'}</h1>
        </div>

        <div className='w-6/12 m-auto h-fit bg-white rounded-md p-12'>
          <form className='' onSubmit={method === 'signup' ? createUser : signInUser}>
            <div className='relative flex flex-col mb-6'>
              <input 
                id='email'
                value={email}
                placeholder=' '
                type="email"
                className='font-body font-normal peer text-normal outline-0 border-b-2 focus:border-papaya border-slate-300 placeholder-transparent p-3 autofill:mt-2'
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                autoFocus
                />
              <label 
                htmlFor="email"
                className='absolute text-sm font-normal top-0 left-3 opacity-75 -translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:left-3 hover:cursor-text peer-focus:top-0 duration-100 peer-focus:text-sm peer-focus:text-papaya'
              >
                Email
              </label>
            </div>
            {
              method === 'signup' &&
              <div className='mb-6'>
                <div className='relative flex flex-col mb-2'>
                  <input type="text"
                    id='username'
                    name='username'
                    value={username}
                    placeholder=' '
                    className='font-body font-normal peer text-normal outline-0 border-b-2 focus:border-papaya border-slate-300 placeholder-transparent p-3 autofill:mt-2'
                    onChange={(e) => {setUsername(e.target.value.trim())}}
                    required
                  />
                  <label 
                    htmlFor="username"
                    className='absolute text-sm font-normal top-0 left-3 opacity-75 -translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:left-3 hover:cursor-text peer-focus:top-0 duration-100 peer-focus:text-sm peer-focus:text-papaya'
                    >
                    Username
                  </label>
                </div>
                 {
                  validUsername ?
                  <small className="before:content-['✓_'] text-emerald-400 text-xs opacity-75">Valid Username</small>
                  :
                  <small className="before:content-['x_'] text-slate-500 text-xs opacity-75">Only letters, numbers and underscores</small>
                }
              </div>
            }
            <div className='relative flex flex-col mb-4'>
              <input 
                id='password1'
                value={password1}
                placeholder=' '
                type="password"
                name='password1input'
                className='peer font-body font-normal text-normal outline-0 border-b-2 focus:border-papaya border-slate-300 placeholder-transparent p-3 pr-10'
                onChange={(e) => setPassword1(e.target.value.trim())}
                required
                />
              <label 
                htmlFor="password1"
                className='absolute text-sm font-normal top-0 left-3 opacity-75 -translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:left-3 hover:cursor-text peer-focus:top-0 duration-100 peer-focus:text-sm peer-focus:text-papaya'
              >
                Enter Password
              </label>
              {
                method === "login" &&
                <>
                  <input 
                    type="checkbox"
                    id="see-pword-1"
                    name="password1input"
                    className='hidden absolute right-0 top-1/2 -translate-y-1/2'
                    onChange={() => toggleVisibility()}
                    // onChange={() => document.getElementById('password1').focus()}
                    />
                  <label 
                    htmlFor="see-pword-1"
                    className='absolute right-0 top-1/2 -translate-y-1/2 bg-white w-6 hover:cursor-pointer'
                    >
                    {
                      passwordVisible ?
                    <VisibilityOutlinedIcon className='text-emerald-400'/> :
                    <VisibilityOffOutlinedIcon />
                    }
                  </label>
                </>
              }
            </div>
            {
              method === "signup" &&
              <ul className='list-none text-xs mb-6 font-normal opacity-80'>
                <li className={`${passwordRequirements.length ? `before:content-['✓_'] text-emerald-400` : `before:content-['x_'] text-slate-500` }`}>Must be atleast 8 characters long</li>
                <li className={`${passwordRequirements.cases ? `before:content-['✓_'] text-emerald-400` : `before:content-['x_'] text-slate-500` }`}>Must have uppercase and lowercase letters</li>
                <li className={`${passwordRequirements.numbers ? `before:content-['✓_'] text-emerald-400` : `before:content-['x_'] text-slate-500` }`}>Must have numbers</li>
                <li className={`${passwordRequirements.specials ? `before:content-['✓_'] text-emerald-400` : `before:content-['x_'] text-slate-500` }`}>Atleast one (1) special character (*, !, &, $, #)</li>
              </ul>
            }
            {
              (validPassword && method === "signup") &&
              <div className='relative flex flex-col mb-10'>
                <input 
                  id='password2'
                  placeholder=' '
                  type="password"
                  className='peer font-body font-normal text-normal outline-0 border-b-2 focus:border-papaya border-slate-300 placeholder-transparent p-3'
                  onChange={(e) => setPassword2(e.target.value.trim())}
                  required
                  />
                <label 
                  htmlFor="password2"
                  className='absolute text-sm font-normal top-0 left-3 opacity-75 -translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:left-3 hover:cursor-text peer-focus:top-0 duration-100 peer-focus:text-sm peer-focus:text-papaya'
                >
                  Re-enter Password
                </label>
              {
                password2.length > 0 ?
                passwordMatch ?
                <small className="before:content-['✓_'] text-emerald-400 text-xs">Passwords match</small>
                :
                <small className='before:content-["x_"] text-slate-500 text-xs'>Passwords do not match</small>
                :
                ""
              }

              </div>
            }
            <br />
            <br />
            <div className='flex items-center justify-center w-full'>
              {
                method === "signup" ?
                <button className='p-2 border-2 border-papaya rounded-sm bg-papaya text-white disabled:hover:cursor-not-allowed' disabled={!validPassword || !passwordMatch || !validEmail}>Sign Up</button>
                :
                <button id='submit-btn' className='p-2 border-2 border-papaya rounded-sm bg-papaya text-white disabled:hover:cursor-not-allowed'>Login</button>
              }
            </div>
          </form>
          <br />
          <br />
          <hr />
          <br />
          <div className='flex space-x-2 text-sm w-full'>
            {
              method === "signup" ?
              <>
                <p className=''>Already have an account? </p>
                <button className='text-papaya' onClick={() => setMethod('login')}>Login</button>
              </>
              :
              <>
                <p className=''>Don't have an account? </p>
                <button className='text-papaya' onClick={() => setMethod('signup')}>Sign Up</button>
              </>
            }
            <p className='text-center'> | </p>
            <button className='text-papaya'>Continue as Anonymous</button>
          </div>
          <div className='flex'>
            <button><img src="" alt="" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup