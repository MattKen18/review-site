import React, { useEffect, useState } from 'react'
import { chatAddOns } from '../parameters'
import AddOnChatEntryView from './AddOnChatEntryView'
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';


import { useDispatch } from 'react-redux';

const ChatEntryLine = ({hasAddOns, entry}) => {
  const [addOnTypeShowing, setAddOnTypeShowing] = useState(Object.keys(chatAddOns)[0])
  const [addOnsSectionShowing, setAddOnsSectionShowing] = useState(false);


  const dispatch = useDispatch();
  useEffect(() => {
    console.log(entry)
  }, [entry])

  const capitalize = (word) => {
    return word[0].toUpperCase() + word.slice(1)
  }

  return (
    <div>
      {
        hasAddOns && entry.type === 'message' &&
        <>
          {
            addOnsSectionShowing && 
            <>
              <div className='flex flex-row group/addOns w-full space-x-2 mb-2'>
                <button className='px-2 relative rounded-md group-hover:text-inherit group-hover:bg-error text-transparent bg-transparent'>{capitalize(addOnTypeShowing)}</button>
                <span className='text-transparent group-hover:text-inherit'><ArrowRightOutlinedIcon /></span>
                <ul className='group-hover:flex group-hover:flex-row hidden'>
                  {
                    Object.keys(chatAddOns).map((addOnType, key) => {
                      return addOnType !== addOnTypeShowing && <li key={key} onClick={() => setAddOnTypeShowing(addOnType)} className={`px-2 mr-2 hover:cursor-pointer rounded-md group-hover:text-inherit bg-tertiary relative hover:bg-success text-transparent bg-transparent`}>{capitalize(addOnType)}</li>
                    })
                  }
                </ul>
              </div>
              <AddOnChatEntryView addOns={entry?.addOns} type={addOnTypeShowing} />
            </>
          }
        </>

      }
      {
        <div className='relative group pl-5'>
          {
            entry.type === 'message' ?
              <div className=''>
                {
                  hasAddOns &&
                  <span className={`absolute flex items-center justify-center -left-[5px] px-[2px] top-1/2 -translate-y-1/2 group-hover:block rounded-md ${addOnsSectionShowing ? 'text-success block animate-none' : 'hidden group-hover:animate-pulse bg-tertiary'} hover:text-success hover:cursor-pointer`} onClick={() => setAddOnsSectionShowing(showing => !showing)}><AutoAwesomeOutlinedIcon sx={{ fontSize: '1rem' }} /></span>
                }
                <p className=''>{entry?.body}</p>
              </div>
            :
            entry.type === 'deleted' &&
              <p className='text-sm opacity-30'>Message deleted</p>
          }
        </div>
      }
    </div>
  )
}

export default ChatEntryLine