import React from 'react'

const InformCard = ({params: {content, subContent='', type, emoji=''}}) => {
  return (
    <div className='flex flex-col items-center justify-center w-fit m-auto mb-10'>
    <p className={`${type == 'inform' ? `bg-success` : type == 'alert' ? `bg-fail` : `bg-primary`} opacity-80 text-white p-2 rounded-md`}>{content}{emoji}</p>
    <p className='text-[0.65rem]'>{subContent}</p>
    </div>
  )
}

export default InformCard