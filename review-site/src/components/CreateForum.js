import React, { useEffect, useState } from 'react'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { forumNameLength } from '../parameters'
import { createForumInFirestore } from '../firebase';
import Loader from './Loader';
import Alert from './Alert';

const CreateForum = ({user, addForumToState}) => {
  const [forumName, setForumName] = useState('')
  const [forumTopic, setForumTopic] = useState('')
  const [maxNumOfMembers, setMaxNumOfMembers] = useState(2)
  const [lifespan, setLifespan] = useState(30)

  const [errors, setErrors] = useState({
    invalidCharInName: false,
    invalidCharInTopic: false,
  })

  const [valid, setValid] = useState(true)
  const [forumCreated, setForumCreated] = useState(false)

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const maximumNumberOfParticipants = 1000
  const minimumNumberOfParticipants = 2




  const handleForumName = (e) => {

    if (e.target.value.length <= forumNameLength) {
      setForumName(e.target.value)

      if (!e.target.value.length) {
        setErrors({...errors, invalidCharInName: false})
      } else if (/^[a-zA-Z0-9\s]+$/.test(e.target.value)) {
        setErrors({...errors, invalidCharInName: false})
      } else {
        setErrors({...errors, invalidCharInName: true})

      }
    }

  }

  const handleTopicName = (e) => {

    if (e.target.value.length <= forumNameLength) {
      setForumTopic(e.target.value)

      if (!e.target.value.length) {
        setErrors({...errors, invalidCharInTopic: false})
      } else if (/^[a-zA-Z0-9\s]+$/.test(e.target.value)) {
        setErrors({...errors, invalidCharInTopic: false})
      } else {
        setErrors({...errors, invalidCharInTopic: true})

      }
    }

  }

  const handleMaxMembers = (e) => {
    if (e.target.value > maximumNumberOfParticipants) {
      setMaxNumOfMembers(maximumNumberOfParticipants)
    }else if (e.target.value < minimumNumberOfParticipants) {
      setMaxNumOfMembers(minimumNumberOfParticipants)
    } else {
      setMaxNumOfMembers(parseInt(e.target.value, 10))
    }
  }


  useEffect(() => {
    setValid(Object.values(errors).every(val => val === false))
  }, [errors])

  const createNewForum = (e) => {
    e.preventDefault()
    if (valid && !loading) {
      const forumData = {
        name: forumName,
        topic: forumTopic,
        maxNumOfMembers: maxNumOfMembers,
        lifespan: lifespan,
      }

      setLoading(true)
      createForumInFirestore(user.uid, forumData).then(forumId => {
        setLoading(false)
        if (forumId) {
          setForumCreated(true)
        } 
        addForumToState(forumId)
      })
    }
  }


  useEffect(() => {
    if (forumCreated) {
      setForumName('')
      setForumTopic('')
      setMaxNumOfMembers(2)
      setLifespan(30)
    
      setForumCreated(false)
      
    }
  }, [forumCreated])


  return (
    <div className='relative w-7/12 pt-10'>
      {
        alert &&
        <div className='absolute top-0 left-1/2 -translate-x-1/2'>
          <Alert content={{body: alert.body, type: alert.type}} />
        </div>
      }
      <h1 className='font-bold text-xl text-center'>Create Forum</h1>
      <form id='create-forum-form' className='pt-10 flex flex-col space-y-8' autoComplete='off' onSubmit={createNewForum}>
        <div className='flex flex-col space-y-2 justify-center'>
          <label 
            htmlFor="forum-create-name"
            className='font-bold pl-2'
            >Name
          </label>
          <input 
            type="text"
            id="forum-create-name"
            placeholder='Choose a name for your forum'
            value={forumName}
            onChange={handleForumName}
            className={`flex-1 outline-none p-2 rounded-md opacity-90 ${errors.invalidCharInName && `border-2 border-error`}`}
            maxLength={forumNameLength}
            required
            />
          <small className='pl-2'>{errors['invalidCharInName'] && <span className='font-bold text-error flex items-center space-x-2'><ErrorOutlineOutlinedIcon className='' fontSize='small' /> <span>Only letters and numbers</span></span>}</small>
        </div>
        <div className='flex flex-col space-y-2 justify-center'>
          <label 
            htmlFor="forum-create-topic"
            className='font-bold pl-2'
            >Topic
          </label>
          <input 
            type="text"
            id="forum-create-topic"
            placeholder='Choose a topic'
            value={forumTopic}
            onChange={handleTopicName}
            className={`flex-1 outline-none p-2 rounded-md opacity-90 ${errors.invalidCharInTopic && `border-2 border-error`}`}
            required
            />
          <small className='pl-2'>{errors['invalidCharInTopic'] && <span className='font-bold text-error flex items-center space-x-2'><ErrorOutlineOutlinedIcon className='' fontSize='small' /> <span>Only letters and numbers</span></span>}</small>
        </div>

        <div className='flex justify-between'>
        <div className='flex space-x-4 items-center'>
            <label 
              htmlFor="lifespan"
              className='w-30 break-words font-bold'
              >
              Lifespan
            </label>
            <select 
              value={lifespan}
              onChange={(e) => setLifespan(e.target.value)}
              id='lifespan'
              className='w-30 outline-none p-2 rounded-md opacity-90 text-center'
              required
            >
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div className='flex space-x-4 items-center'>
            <label 
              htmlFor="num-of-members"
              className='w-30 break-words font-bold'
              >
              Max members
            </label>
            <input 
              type="number"
              id='num-of-members'
              className='w-20 outline-none p-2 rounded-md opacity-90 text-center'
              value={maxNumOfMembers}
              onChange={handleMaxMembers}
              min={2}
              max={1000}
              required

            />
            <small>max 1000</small>
          </div>

        </div>
        <br />
        <button className={`bg-pink-600 h-full text-white p-2 rounded-md ${loading && `opacity-70`} disabled:cursor-not-allowed`} disabled={loading}>
          {
            loading ?
              <div className='w-40 m-auto flex flex-row justify-center items-center space-x-2'>
                <span>Creating</span>
                <Loader params={{
                  content: [],
                  type: 'bars',
                  color: 'white',
                  height: '20px',
                  width: '20px',
                }} /> 
              </div>
            :
            <span>Create</span>
          }</button>
      </form>
    </div>
  )
}

export default CreateForum