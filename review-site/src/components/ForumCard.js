import React, { useEffect, useState } from 'react'
import forumDefaultThumb from '../assets/default-forum-thumbnail.jpg'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

const ForumCard = ({forum, enterForum}) => {
  const [userJoined, setUserJoined] = useState(true) //if the user is a member of the forum
  const [optionsShown, setOptionsShown] = useState(false)

  // const toggleOptionsMenu = () => {
  //   const optionsMenu = document.getElementById('options-menu-'+forum.id)
  //   if (optionsMenu.style.display) {
  //     optionsMenu.style.display = ''
  //     setOptionsShown(false)
  //   } else {
  //     optionsMenu.style.display = 'block'
  //     setOptionsShown(true)
  //   }
  // }

  useEffect(() => {
    const optionsMenu = document.getElementById('options-menu-'+forum.id)

    if (!optionsShown) {
      optionsMenu.style.display = ''
    } else {
      optionsMenu.style.display = 'block'
    }

  }, [optionsShown])


  useEffect(() => {
    const optionsMenu = document.getElementById('options-menu-'+forum.id)
    const optionsButton = document.getElementById('options-button-'+forum.id)

    
    const handleClickOutside = (e) => {
      const clickedOptionsBtn = e.target === optionsButton || e.target.closest("button") === optionsButton
      const clickedOutside = !optionsMenu.contains(e.target)

      if (clickedOutside && !clickedOptionsBtn) { //if click is outside of the options menu
        setOptionsShown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [])


  return (
    <div className='group relative w-full border-[1px] rounded-xl h-16 bg-gray-100 hover:cursor-pointer'>
      <div onClick={() => enterForum(forum)} className={`${optionsShown && `blur-[1px]`} relative z-0 flex space-x-2 items-center py-2 px-1 h-full w-full`}>
        <div className='w-1/5 h-full flex items-center justify-center'>
          <div className='h-12 w-12 rounded-full overflow-hidden'>
            <img src={forumDefaultThumb} alt="forum thumbnail" className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='flex flex-col flex-1 justify-between'>
          <div className='h-1/5 flex flex-col -space-y-1'>
            <p className='relative z-10 font-bold text-sm w-52 line-clamp-1'>{forum.name}</p>
            <small className='relative z-0 text-[.55rem] w-fit font-light'>{forum.topic}</small>
          </div>
          <div className='flex items-center h-[25px]'>
            {/* most recent chat */}
            <p className='rounded-xl text-[.65rem]'>new300User: Hello There!</p>
          </div>
        </div>
      </div>
      <div className='absolute z-10 bottom-2 right-2 w-8 h-8 items-end justify-center rounded-xl '>
        <button id={`${'options-button-'+forum.id}`} onClick={() => setOptionsShown(shown => !shown)} className={`relative z-10 text-[.55rem] w-full h-full rounded-lg hover:bg-gray-200 ${optionsShown && `bg-gray-200`} active:scale-90 duration-100`}>
          <MoreVertOutlinedIcon className='' />
        </button>
        <div id={`${'options-menu-'+forum.id}`} className={`${!optionsShown && `hidden`} absolute bg-gray-200 -bottom-20 right-10 rounded-lg overflow-hidden w-20 `}>
          <ul className='text-sm'>
            <li className=' hover:bg-success hover:text-white px-2 py-1'>Enter</li>
            <li className=' hover:bg-primary hover:text-white px-2 py-1'>Details</li>
            <li className=' hover:bg-primary hover:text-white px-2 py-1'>Mute</li>

            {
              userJoined ?
              <li className=' hover:bg-error hover:text-white px-2 py-1'>Leave</li>
              :
              <li className=' hover:bg-primary hover:text-white px-2 py-1'>Join</li>
            }
          </ul>
        </div>
      </div>
      <span className={`${optionsShown && `blur-[1px]`} absolute flex-none top-1 right-2 text-[.65rem] text-success`}>{forum.lifespan} mins</span>
    </div>
  )
}

export default ForumCard