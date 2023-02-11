import React, { useEffect, useState } from 'react'
import { updateUserProfileWithLinks } from '../firebase'
import Alert from './Alert'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const AddLinkModal = ({user, links, close, easyClose}) => {
  const [newLinks, setNewLinks] = useState({
    facebook: '',
    gmail: '',
    instagram: '',
    linkedIn: '',
    tiktok: '',
    twitter: '',
    youtube: '',
  })
  const [alert, setAlert] = useState(null)


  useEffect(() => {

    const linksCopy = {...newLinks}
    for (let link of links) {
      linksCopy[link[0]] = link[1]
    }
    setNewLinks(linksCopy)
  }, [])

  useEffect(() => {
    if (newLinks) {
      console.log("new links: ", newLinks)
    }
  }, [newLinks])

  const updateLink = (linkName, linkVal) => {
    const linksCopy = {...newLinks}
    linksCopy[linkName] = linkVal
    setNewLinks(linksCopy)
  }

  const reformatLinks = () => {
    const reformattedLinks = []

    for (let link in newLinks) {
      reformattedLinks.push([link, newLinks[link]])
    }

    return reformattedLinks
  }

  const saveUpdatedLinks = (e) => {
    e.preventDefault()
    const formattedLinks = reformatLinks()

    updateUserProfileWithLinks(user.uid, formattedLinks).then(success => {
      if (success) {
        console.log('successfully updated profile links')
        setAlert({body: "Successfully updated profile links", type: "success"})
        setTimeout(() => {
          close()
        }, 1000);
      } else {
        console.log('failed to update profile links')
        setAlert({body: "Failed to update profile links", type: "error"})

      }
    })
  }

  return (
    <div className='fixed top-0 bottom-0 z-20 w-screen h-screen flex items-center justify-center backdrop-filter backdrop-blur-sm'>
      <div onClick={easyClose} className='absolute w-full h-full backdrop-filter backdrop-blur-sm'>
        {
          alert &&
          <Alert content={{body: alert.body, type: alert.type}} />
        }
        
      </div>
      <div className='relative w-6/12 h-fit rounded-md shadow-2xl bg-white p-20'>
        <h1 className='text-center text-2xl font-bold'>Edit Links</h1>
        <form className='mt-10 flex flex-col items-center space-y-4' onSubmit={saveUpdatedLinks}>
          {
           links.map((link, i) => (
            <div key={i} className='flex space-x-4 items-center w-full'>
              <label htmlFor={`${link[0]}-input`} className='w-20 font-bold'>{link[0][0].toUpperCase() + link[0].slice(1,)}</label>
              <input 
                id={`${link[0]}-input`}
                className='peer flex-1 p-2 border-b-2 outline-none focus:outline-none focus:border-b-emerald-400 duration-100 opacity-80 focus:opacity-100'
                type="text"
                value={newLinks[link[0]]}
                placeholder={'Click to add'}
                onChange={(e) => updateLink(link[0], e.target.value.trim())}
                autoComplete='off'
              />
              <ClearOutlinedIcon onClick={(e) => {e.preventDefault(); updateLink(link[0], '')}} className='hover:cursor-pointer text-transparent peer-focus:text-red-500' />
            </div>
           )) 
          }
          <button className='w-fit bg-emerald-400 p-2 text-white rounded-sm hover:bg-emerald-300'>Update</button>
        </form>
      </div>
    </div>
  )
}

export default AddLinkModal