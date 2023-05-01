import React, { useEffect } from 'react'
import forumDefaultThumb from '../assets/default-forum-thumbnail.jpg'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';

const ForumRoom = ({forum}) => {

  useEffect(() => {
    const resizeForum = () => {
      const headerHeight = window.getComputedStyle(document.getElementById('header')).getPropertyValue('height')
      const forumRoom = document.getElementById('forum-room')
  
      const newForumHeight = window.innerHeight - headerHeight.slice(0, headerHeight.length-2)

      if (newForumHeight > 1500) {
        forumRoom.style.height = 1500+'px'
      } else {
        forumRoom.style.height = newForumHeight+'px'
      }
    }

    resizeForum()
    window.addEventListener('resize', resizeForum)

    return () => window.removeEventListener('resize', resizeForum)
  }, [])

  return (
    <div id={'forum-room'} className='flex flex-col w-full'>
      <div className='relative flex h-16 bg-gray-200 p-2 pr-20 space-x-4'>
        <div className='w-12 h-12 rounded-full overflow-hidden'>
          <img src={forumDefaultThumb} alt="forum thumbnail" className='w-full h-full object-cover' />
        </div>
        <div className='flex flex-col flex-1 -space-y-1'>
          <h1 className='font-bold text-xl'>{forum.name}</h1>
          <small className='font-light'>{forum.topic}</small>
        </div>
        <div className='flex items-center text-sm'>
          <p className=''><QueryBuilderOutlinedIcon /> <span className='text-success'>{forum.lifespan} mins</span></p>
        </div>
        <span className='flex-none absolute top-1/2 -translate-y-1/2 right-5'>X</span>
      </div>
      <div className='flex-1 bg-white w-full overflow-y-scroll'>
        <div className='h-[2000px]'>

        </div>
      </div>
      <div className='flex h-12 p-2'>
        <div className='w-10'>

        </div>
        <input 
          type="text"
          className='flex-1 rounded-lg outline-none px-2 border-2 border-gray-700'
        />
        <div className='w-10'>

        </div>
      </div>
    </div>
  )
}

export default ForumRoom