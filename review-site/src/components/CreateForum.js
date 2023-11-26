import React, { useEffect, useState } from 'react'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

import { forumNameLength } from '../parameters'
import { createForumInFirestore } from '../firebase';
import Loader from './Loader';
import Alert from './Alert';
import forumDefaultThumb from '../assets/default-forum-thumbnail.jpg'
import ReactS3Client from 'react-aws-s3-typescript';
import { useDispatch } from 'react-redux';
import { addAlert } from '../slices/alertSlice';

const S3_BUCKET ='test-image-store-weviews';
const REGION ='us-east-2'; 
const ACCESS_ID ='AKIAR74LVHA4ZCOAF7OT';
const SECRET_ACCESS_KEY ='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';

const config = {
  bucketName: S3_BUCKET,
  dirName: 'profileImages', 
  region: REGION,
  accessKeyId: ACCESS_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
}

const s3 = new ReactS3Client(config);

const CreateForum = ({user, addForumToState}) => {
  const [forumName, setForumName] = useState('')
  const [forumTopic, setForumTopic] = useState('')
  const [maxNumOfMembers, setMaxNumOfMembers] = useState(2)
  const [lifespan, setLifespan] = useState(30)
  const [stagedForumThumbnail, setStagedForumThumbnail] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)

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


  const dispatch = useDispatch();


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
    setMaxNumOfMembers(e.target.value)
    // if (e.target.value > maximumNumberOfParticipants) {
    //   setMaxNumOfMembers(maximumNumberOfParticipants)
    // } else if (e.target.value < minimumNumberOfParticipants) {
    //   setMaxNumOfMembers(minimumNumberOfParticipants)
    // } else {
    //   setMaxNumOfMembers(parseInt(e.target.value, 10))
    // }
  }

  const ensureMembersWithinLimits = () => {
    if (maxNumOfMembers < 2) {
      setMaxNumOfMembers(2)
    } else if (maxNumOfMembers > maximumNumberOfParticipants) {
      setMaxNumOfMembers(maximumNumberOfParticipants)
    }
  }


  useEffect(() => {
    setValid(Object.values(errors).every(val => val === false))
  }, [errors])

  const createNewForum = async (e) => {
    e.preventDefault()
    if (valid && !loading) {
      try {
        const url = stagedForumThumbnail ? await uploadForumThumbnailToS3() : ''
        const forumData = {
          name: forumName,
          topic: forumTopic,
          maxNumOfMembers: maxNumOfMembers,
          lifespan: lifespan,
          thumbnail: url,
        }
        setLoading(true)
        createForumInFirestore(user.uid, forumData).then(forum => {
          setLoading(false)
          if (forum) {
            setForumCreated(true)
          } 
          addForumToState(forum)
        })

      } catch (e) {
        dispatch(addAlert({body: "Error creating forum", type: "error"}))
      }

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

  const addForumThumbnail = e => {
    if (e.target.files[0].type.match('image.*')) {
      const image = e.target.files[0]
      const reader = new FileReader();
      reader.onloadend = () => {
        setStagedForumThumbnail(reader.result)
        setThumbnailFile(image)
      }
      reader.readAsDataURL(image)
      document.getElementById('thumbnail-input').value = ''
    } else {
      alert("Invalid File Type")
    }
  }


  const uploadForumThumbnailToS3 = async () => { //this function uploads the profile image to s3 and returns the image s3 path
    try {
      const fileName = forumName + '-thumbnail' + new Date().toString().split(" ").slice(0, 5).join("-")
      const res = await s3.uploadFile(thumbnailFile, fileName);
      document.getElementById('thumbnail-input').value = ''
      return res.location
    } catch (exception) {
        console.log(exception);
    }
    return
  }

  return (
    <div className='relative w-7/12 pt-10'>
      <h1 className='font-bold text-xl text-center'>Create Forum</h1>
      <form id='create-forum-form' className='pt-10 flex flex-col space-y-8' autoComplete='off' onSubmit={createNewForum}>
        <div className='w-full flex flex-col space-y-2 items-center justify-center'>
          <label htmlFor="thumbnail-input"
            className={`relative group w-40 h-40 flex items-center justify-center hover:opacity-70 hover:cursor-pointer before:absolute before:bottom-0 before:w-full before:h-[40%] ${stagedForumThumbnail ? 'before:bg-success' : 'before:bg-rose-400'} before:-z-50 before:rounded-md z-50`}>
            <img src={stagedForumThumbnail ? stagedForumThumbnail : forumDefaultThumb} alt="forum thumbnail" className='rounded-md w-[90%] h-[90%] object-cover' />
            <span className='hidden group-hover:block absolute text-white'><AddPhotoAlternateOutlinedIcon /></span>
          </label>
          <p className='font-light text-sm'>Choose thumbnail</p> 
          <input
            onChange={addForumThumbnail}
            id="thumbnail-input" type='file'
            className='hidden'
          ></input>
          {
            stagedForumThumbnail &&
            <button 
              type='button' onClick={() => setStagedForumThumbnail(null)}
              className='text-sm px-2 py-[1px] bg-fail text-white rounded-md'
            >
              reset
            </button>
          }
        </div>
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
              onBlur={() => ensureMembersWithinLimits()}
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