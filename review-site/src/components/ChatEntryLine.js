import React, { useState } from 'react'
import { chatAddOns } from '../parameters'
import AddOnChatEntryView from './AddOnChatEntryView'
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import { useDispatch } from 'react-redux';

const ChatEntryLine = ({hasAddOns, entry}) => {
  const [addOnTypeShowing, setAddOnTypeShowing] = useState(Object.keys(chatAddOns)[0])

  const dispatch = useDispatch();

  const capitalize = (word) => {
    return word[0].toUpperCase() + word.slice(1)
  }

  return (
    <div>
      {
        hasAddOns && entry.type === 'message' &&
        <>
          <div className='flex flex-row group/addOns w-full space-x-2 mt-2'>
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
      {
        entry.type === 'message' ?
          <p className='pl-2'>{entry?.body}</p>
        :
        entry.type === 'notification' ?
          <p className='pl-2'></p>
        :
        entry.type === 'deleted' &&
          <p className='pl-2 text-sm opacity-30'>Message deleted</p>
      }
    </div>
  )
}

export default ChatEntryLine