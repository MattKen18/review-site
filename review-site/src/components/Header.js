import React from 'react'
import { PencilSquareIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

const Header = () => {
  return (
    <header className='flex flex-col lg:flex-row text-md px-5 py-5 lg:px-20 border-b-2 border-slate-200 items-center min-w-full sticky top-0 bg-white'>
      <div className='flex items-center space-x-4 mr-4 lg:mr-10 xl:mr-20'>
        <h1 className='font-display text-3xl font-extrabold'>Weviews</h1>
        <a href="/" className=''><PencilSquareIcon className='transition ease-in-out duration-300 w-7 hover:text-papaya hover:scale-110' /></a>
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
      <div className='flex flex-col lg:flex-row justify-end ml-4 lg:ml-10 xl:ml-20'>
        <ul className='flex flex-col lg:flex-row items-center space-x-2 lg:space-x-4 xl:space-x-8'>
          <li><a href="/" className='hover:text-papaya'>Write Review</a></li>
          <li><a href="/" className='hover:text-papaya'>Browse</a></li>
          <li><a href="/" className='hover:text-papaya'>Contact</a></li>
        </ul>
        <div className='flex space-x-0 items-center ml-2 lg:ml-4 xl:ml-20'>
          <a href="/"><UserCircleIcon className='w-10' /></a>
          <a href="/"><ChevronDownIcon className='w-4' /></a>
        </div>
      </div>
    </header>
  )
}

export default Header