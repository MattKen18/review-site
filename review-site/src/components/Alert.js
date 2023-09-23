import React, { useEffect } from 'react'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import $ from 'jquery'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch } from 'react-redux';
import { removeAlert } from '../slices/alertSlice';

const Alert = ({content: {body, type}, timeout=3000}) => {
  // type = error or inform or success

  const dispatch = useDispatch()

  const closeAlert = () => {
    dispatch(removeAlert()) 
  }

  useEffect(() => {
    setTimeout(() => {
      closeAlert()
    }, [timeout])
  }, [timeout])


  return (
    <div className={`h-full w-full  rounded-md shadow-xl overflow-hidden border-[1px]`}>
        <div className={`flex flex-row items-center justify-center h-full ${type === 'success' ? 'bg-[#ECF7EC] border-white' : type === 'error' ? 'bg-red-200 border-red-200' : type === 'inform' && 'bg-slate-200 borde-slate-200'}`}>
          <div className={`basis-1/12 h-full ${type === 'success' ? 'bg-success' : type === 'error' ? 'bg-error' : type === 'inform' && 'bg-secondary'}`}>

          </div>
          <div className='basis-10/12 px-2 py-1 overflow-hidden'>
            <p className='text-sm leading-3'>{body}</p>
          </div>
          <button className='basis-2/12 h-full bg-white' onClick={closeAlert}>
            <CloseOutlinedIcon sx={{fontSize: 15}} />
          </button>
        </div>
      
    </div>
  )

}

export default Alert