import React, { useEffect } from 'react'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import $ from 'jquery'

const Alert = ({content: {body, type}}) => {
  // type = error or inform

  useEffect(() => {
    $('#alert').fadeIn(500, () => {
      setTimeout(() => {
        $('#alert').fadeOut(500)
      }, 3000)
    });
  }, [])

  return (
    <div className='h-10 mb-7'>
      {
        type === "inform" ?        
        <p id="alert" className='w-fit m-auto text-center mb-10 border-2 border-green-100 bg-green-100 py-2 px-4 text-green-500 font-body hidden'>
          <AutoAwesomeOutlinedIcon className='mr-2' />
          {body} 
          <AutoAwesomeOutlinedIcon className='ml-2' />
        </p>
        :
        <p id="alert" className='w-fit m-auto text-center mb-10 border-2 border-rose-100 bg-rose-100 py-2 px-4 text-rose-500 font-body hidden'>
          <span className='bg-rose-100'>
            <ErrorOutlineOutlinedIcon className='mr-2' />
          </span>
          {body} 
      </p>
      }
    </div>
  )
}

export default Alert