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
import { NavLink } from 'react-router-dom';

const SingleChatEntry = ({chatEntry, currentUserOwnsEntry, getTimestamp, deleteChatEntry, startEdit, startReply, entryBeingEdited}) => {
  const [addOnTypeShowing, setAddOnTypeShowing] = useState(Object.keys(chatAddOns)[0])
  const [chatEntryLines, setChatEntryLines] = useState();

  useEffect(() => {
    console.log(chatEntry)
  }, [chatEntry])


  const dispatch = useDispatch();
  // dispatch(addAlert({body: "Successfully added chat", type: "success"}))

  const aggregatedEntryHasAddOns = (entryLine) => {
    try {
      const entryAddOns = JSON.parse(entryLine.addOns)
      for (let addOnType in entryAddOns) {
        if (entryAddOns[addOnType].length > 0) {
          return true
        }
      }
    } catch (e) { // entry is a notification

    }

    return false
  } 

  return (
    <>
      <div className='w-full h-fit flex flex-row space-x-2 text-light-text rounded-l-full'>
        <div className=''>
          <ProfileThumbnail thumbnailSrc={chatEntry?.author?.photoURL} link={`/user/${chatEntry?.author?.uid}/profile`} size={'medium'} />
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
            <NavLink to={`/user/${chatEntry?.user}/profile`} className=''>
              <span className='underline-none font-bold opacity-60 group-hover:opacity-100 duration-100'>@</span>
              <span className='underline underline-offset-2'>{chatEntry?.author?.userName}</span>
            </NavLink>
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
                entry.type != 'notification' ?
                // chat entry line
                <div key={key} className={`w-full pl-2 relative flex group py-1 rounded-lg ${entryBeingEdited?.id === entry.id ? 'bg-secondary hover:bg-secondary animate-pulse' : 'bg-inherit hover:bg-[#1B2536]'}`}>
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
                        {/* reply */}
                        <span className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center relative z-0 after:content-[""] after:absolute after:right-0 after:z-10 after:w-[1px] after:h-full after:bg-[#2E3D82]'><UndoOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                        {/* edit */}
                        {
                          currentUserOwnsEntry ?
                          <span onClick={() => startEdit(entry, entry?.author)} className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center relative z-0 after:content-[""] after:absolute after:right-0 after:z-10 after:w-[1px] after:h-full after:bg-[#2E3D82]'><CreateOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                          :
                          <span className='hover:cursor-not-allowed flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center relative z-0 after:content-[""] after:absolute after:right-0 after:z-10 after:w-[1px] after:h-full after:bg-[#2E3D82]'><CreateOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                        }
                        {/* delete */}
                        {
                          currentUserOwnsEntry ?
                          <span role={'button'} onClick={() => {deleteChatEntry(entry.id, entry.forum)}} className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center'><DeleteOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                          :
                          <span className='flex basis-1/3 hover:bg-[#2E3D82] items-center justify-center'><PriorityHighOutlinedIcon sx={{ fontSize: '1.15rem' }} /></span>
                        }
                      </span>
                    }
                    <span className='px-2 relative z-[0] opacity-60 font-light flex-end flex flex-col -space-y-2'>
                      <p className=''>
                        {entry.timestamp}
                      </p>
                      {
                        entry.edited && entry.type != 'deleted' &&
                        <p className='text-2xs text-highlight'>edited</p>
                      }
                    </span>
                  </div>
                </div> 
                :
                <>
                  <div className='w-[95%] flex flex-col -space-y-1 items-center justify-center opacity-50'>
                    <p className={`h-full text-center font-bold ${entry.body.includes('joined') ? 'text-success' : 'text-secondary'}`}>{entry.body}</p>
                    <p className='opacity-30 h-full text-xs'>{entry.timestamp}</p>
                  </div>
                  <hr className='bg-slate-200 w-full opacity-20' />
                </>
              ))
            }
          </div>

          {/* bottom content */}
          <div>

          </div>
        </motion.div>
        {/* thumbnail */}
      </div>
    </>
  )
}

export default SingleChatEntry