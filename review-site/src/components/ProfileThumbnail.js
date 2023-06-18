import React from 'react'

const ProfileThumbnail = ({thumbnailSrc, clickable, size}) => {
  return (
    <div className={` ${size === 'sm' ? `w-6 h-6` : `w-12 h-12`} overflow-hidden rounded-full`}>
      <img src={thumbnailSrc} alt="user thumbnail" className='w-full h-full object-cover' />
    </div>
  )
}

export default ProfileThumbnail