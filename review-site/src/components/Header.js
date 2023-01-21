import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PencilSquareIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";



const Header = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
  }, [])

  useEffect(() => {
    // console.log("current user from use Effect: ", currentUser)
    if (!currentUser) {
      // window.location.reload()
    }
    console.log(currentUser)
  }, [currentUser])

  const signOutUser = () => {
    signOut(auth).then(() => {
      console.log("Successfully Signed out")
    }).catch((error) => {
      console.log(error)
    });
  }




  return (
    <header className='flex flex-col lg:flex-row text-md px-5 py-5 lg:px-20 border-b-2 border-slate-200 items-center min-w-full sticky top-0 bg-white z-10'>
      <div className='flex items-center space-x-4 mr-4 lg:mr-10 xl:mr-20'>
        <h1 className='font-display text-3xl font-extrabold'><a href='/'>Weviews</a></h1>
        <NavLink to="/compose" className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}><PencilSquareIcon className='transition ease-in-out duration-300 w-7 hover:text-papaya hover:scale-110' /></NavLink>
      </div>
      <div className='relative flex-1 items-center overflow-hidden rounded-3xl'>
        <input className='w-full text-lg border-2 font-md border-slate-400 opacity-75 rounded-3xl p-3 h-10 bg-transparent focus:border-slate-500 focus:outline-slate-500'
          type='text' placeholder='Find reviews...' />
        <div className='absolute h-full right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <a href="/" className='relative flex h-full before:absolute before:bg-papaya before:h-full before:w-20 before:-z-10 before:-right-11'>
            <MagnifyingGlassIcon className='text-white w-6' />
          </a>
        </div>
      </div>
      {
        currentUser ?
          <div className='flex flex-col items-center justify-center space-x-8 lg:flex-row ml-4 lg:ml-10 xl:ml-20'>
            <p><NavLink to="/" className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}>Browse</NavLink></p>
            <p><NavLink to="/compose" className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}>Write Review</NavLink></p>
            <p><NavLink to={`/user/${currentUser?.uid}/dashboard`} className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}>Dashboard</NavLink></p>
            <div className='w-40'>
              <p className='hover:cursor-pointer border-2 border-green-100 bg-green-100 p-2 px-4 rounded-full text-sm font-bold font-body text-center overflow-ellipsis whitespace-nowrap overflow-hidden'><span className=''>{currentUser.isAnonymous ? "Anonymous" : currentUser.displayName ? currentUser.displayName : currentUser.email}</span></p>
            </div>
            <div className='relative group'>
              <div className={`peer flex ${currentUser.photoURL ? `space-x-1` : `space-x-0`} items-center`}>
                <span className='w-10 overflow-hidden rounded-full'>
                  {
                    currentUser?.photoURL ? 
                    <img src={currentUser?.photoURL} alt="user profile image" className='w-10 h-10' />
                     : 
                    <UserCircleIcon className='w-full' />
                  }
                </span>
                <span className='group-hover:rotate-180 duration-100'><ChevronDownIcon className='w-4' /></span>
              </div>
              <div className='absolute peer-hover:block hover:block hidden w-32 border-0 border-slate-100 bg-slate-100 rounded-md shadow-md overflow-hidden'>
                <ul>
                  <li className='hover:bg-papaya hover:text-white hover:cursor-pointer'><a className='p-2 block w-full h-full' href={`${!currentUser?.isAnonymous ? `/user/${currentUser?.uid}/profile`: `/`}`}>Profile</a></li>
                  {/* <li className='p-2 hover:bg-papaya hover:text-white hover:cursor-pointer'>Dashboard</li> */}
                  <li  onClick={() => signOutUser()} className='p-2 hover:bg-papaya hover:text-white hover:cursor-pointer'>Logout</li>
                </ul>
              </div>
            </div>
          </div>
            :
          <div className='flex flex-col items-center justify-center space-x-8 lg:flex-row ml-4 lg:ml-10 xl:ml-20'>
            <p><NavLink to="/" className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}>Browse</NavLink></p>
            <p><NavLink to="/compose" className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}>Write Review</NavLink></p>
            <p><NavLink to={`/user/${currentUser?.uid}/dashboard`} className={({ isActive }) => (isActive ? `text-papaya hover:text-papaya` : `hover:text-papaya`)}>Dashboard</NavLink></p>
            <div className='flex w-40 justify-center'>
              <NavLink to="/login-signup"><p className='hover:cursor-pointer hover:scale-110 duration-300 border-2 border-rose-100 bg-rose-100 p-2 px-4 rounded-full text-sm font-bold font-body w-fit text-center'>Login or Signup</p></NavLink>
            </div>
            <div className='relative group'>
              <div className='peer flex space-x-0 items-center'>
                <span><UserCircleIcon className='w-10' /></span>
                <span className='group-hover:rotate-180 duration-100'><ChevronDownIcon className='w-4' /></span>
              </div>
              <div className='absolute peer-hover:block hover:block hidden w-32 border-0 border-slate-100 bg-slate-100 rounded-md shadow-md overflow-hidden'>
                <ul>
                  <li className='p-2 hover:bg-papaya hover:text-white hover:cursor-pointer'><Link className='w-full h-full' to={`login-signup`}>Profile</Link></li>
                  {/* <li className='p-2 hover:bg-papaya hover:text-white hover:cursor-pointer'>Dashboard</li> */}
                  <li className='hover:bg-papaya hover:text-white hover:cursor-pointer'><NavLink to="/login-signup"><p className='p-2'>Login/Sign Up</p></NavLink></li>
                </ul>
              </div>
            </div>
          </div>
      }
    </header>
  )
}

export default Header