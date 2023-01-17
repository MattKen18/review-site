import React, { useEffect } from 'react'
import AdSpace from '../AdSpace'

const Profile = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  


  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div>
        <h1>Profile</h1>
      </div>
    </div>
  )
}

export default Profile