import React from 'react'

const ProfileThumbnail = ({thumbnailSrc, link, size}) => {
  return (
    <div className={` ${size === 'sm' ? `w-6 h-6` : `w-12 h-12`} overflow-hidden rounded-full`}>
      {
        link ?
        <a href={link}>
          <img src={thumbnailSrc} alt="user thumbnail" className='w-full h-full object-cover' />
        </a>
        :
        <img src={thumbnailSrc} alt="user thumbnail" className='w-full h-full object-cover' />
      }
    </div>
  )
}

export default ProfileThumbnail