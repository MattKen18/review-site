import React from 'react'

const ReviewPlaceholder = () => {
  return (
    <div className='relative animate-pulse flex h-[300px] bg-white w-full m-auto rounded-md shadow-sm mb-10 p-6 space-x-4 overflow-hidden'>
      <div className={'absolute bg-gray-200 -top-20 -right-20 w-36 h-28 z-1 rotate-45'}></div>
      <div className='w-1/4 h-full bg-gray-200 border-2 border-gray-200 rounded-md'></div>
      <div className='flex flex-col space-y-4 w-3/4 h-full'>
        <div className='flex w-full space-x-2'>
          <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-[100px] h-[20px]'></div>
          <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-[100px] h-[20px]'></div>
        </div>
        <div className='flex w-full h-[20px] space-x-2'>
          <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-[200px]'></div>
          <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-[100px]'></div>
        </div>
        <div className='border-2 border-gray-200 bg-gray-200 rounded-md w-full flex-1'></div>
        <div className='h-4'></div>
        <div className='flex w-full h-[20px] space-x-2'>
          <div className='flex space-x-2 w-[300px]'>
            <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-40'></div>
            <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-40'></div>
            <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-40'></div>
          </div>
          <div className='flex-1'></div>
          <div className='border-2 border-gray-200 bg-gray-200 rounded-full w-[75px]'></div>
        </div>
      </div>
    </div>
  )
}

export default ReviewPlaceholder