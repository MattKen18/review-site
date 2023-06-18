import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProfileThumbnail from './ProfileThumbnail'

import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';


import AddOnChatEntryView from './AddOnChatEntryView';
import { chatAddOns } from '../parameters';
import ChatEntryLine from './ChatEntryLine';

import { useDispatch } from 'react-redux';
import { addAlert } from '../slices/alertSlice';

const SingleChatEntry = ({chatEntry, currentUserOwnsEntry, getTimestamp, deleteChatEntry}) => {
  const [addOnTypeShowing, setAddOnTypeShowing] = useState(Object.keys(chatAddOns)[0])

  const dispatch = useDispatch();
  // dispatch(addAlert({body: "Successfully added chat", type: "success"}))

  const aggregatedEntryHasAddOns = (entryLine) => {
    for (let addOnType in entryLine.addOns) {
      if (entryLine.addOns[addOnType].length) {
        return true
      }
    }

    return false
  }

  return (
    <div className='w-full h-fit flex flex-row space-x-2 text-light-text rounded-l-full'>
      {/* thumbnail */}
      <div className=''>
        <ProfileThumbnail thumbnailSrc={chatEntry?.author?.photoURL} clickable={true} size={'medium'} />
      </div>

      {/* chat content */}
      <motion.div
        className={`flex-1 flex flex-col w-fit h-fit
        ${currentUserOwnsEntry ? '' 
        : ''}
        `}
        initial={{ x:-10, opacity:0 }}
        animate={{ x: 0, opacity:100 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
      }}
      >
        {/* username */}
        <span className={`group text-xs font-bold ${currentUserOwnsEntry ? 'text-success' : 'text-secondary'}`}>
          <a href='' className=''>
            <span className='underline-none font-bold opacity-60 group-hover:opacity-100 duration-100'>@</span>
            <span className='underline underline-offset-2'>{chatEntry?.author?.userName}</span>
          </a>
        </span>

        {/* chat body*/}
        <div className={`h-full w-full rounded-lg rounded-tl-
          ${currentUserOwnsEntry ? '' 
          : ''}
          `}
        >
          {
            // TODO: create component for chat entry line in order to have unique addOnTypeShowing
            chatEntry?.lines?.map((entry, key) => (
              // chat entry line
              <div key={key} className={`w-full pl-2 relative flex group hover:bg-[#1B2536] py-1 rounded-lg ${aggregatedEntryHasAddOns(entry) && entry.type === 'message' && 'mt-4' }`}>
                {/* chat content */}
                <div className='basis-4/5 flex flex-col'>

                  {/* Add ons view selector*/}
                  <ChatEntryLine hasAddOns={aggregatedEntryHasAddOns(entry)} entry={entry} />
                </div>
                {/* options and timestamp */}
                <div className='hidden basis-1/5 justify-end group-hover:flex text-gray-100 text-xs'>
                  {
                    entry.type === "message" &&
                    <span className='absolute flex-none flex z-[10] w-24 h-8 rounded-md right-20 -top-6 bg-primary hover:cursor-pointer overflow-hidden'>
                      <span className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center relative z-0 after:content-[""] after:absolute after:right-0 after:z-10 after:w-[1px] after:h-full after:bg-[#2E3D82]'><UndoOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                      <span className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center relative z-0 after:content-[""] after:absolute after:right-0 after:z-10 after:w-[1px] after:h-full after:bg-[#2E3D82]'><CreateOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                      {
                        currentUserOwnsEntry ?
                        <span role={'button'} onClick={() => {deleteChatEntry(entry.id, entry.forum)}} className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center'><DeleteOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                        :
                        <span className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center'><PriorityHighOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                      }
                    </span>
                  }
                  <p className='px-2 relative z-[0] opacity-60 font-light flex-end text-right'>{entry.timestamp}</p>
                </div>
              </div> 

            ))
          }
        </div>

        {/* bottom content */}
        <div>

        </div>
      </motion.div>
    </div>
  )
}

export default SingleChatEntry