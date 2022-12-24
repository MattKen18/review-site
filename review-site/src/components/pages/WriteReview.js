import React, { useDebugValue, useEffect, useState } from 'react'
import { addReviewToFireStore, getGenresFromFireStore } from '../../firebase'
import { Prompt } from 'react-router-dom'

import ReactS3Client from 'react-aws-s3-typescript';

import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';

import LoadingAnimation from 'react-loading';
import AdSpace from '../AdSpace';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useNavigate } from 'react-router-dom';
import Alert from '../Alert';

const S3_BUCKET ='test-image-store-weviews';
const REGION ='us-east-2'; 
const ACCESS_ID ='AKIAR74LVHA4ZCOAF7OT';
const SECRET_ACCESS_KEY ='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';

const config = {
  bucketName: S3_BUCKET,
  dirName: 'userName', 
  region: REGION,
  accessKeyId: ACCESS_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
}

const s3 = new ReactS3Client(config);
const auth = getAuth()

const WriteReview = () => {
  const [reviewCreated, setReviewCreated] = useState(false)
  const [genres, setGenres] = useState([])
  const [review, setReview] = useState({
    author: null, //change to current user
    headline: '',
    genre: '',
    tag: '',
    body: '',
    rating: '',
    images: [],
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imagesUploadedToS3, setImagesUploadedToS3] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    getGenresFromFireStore().then(genres => setGenres(genres))
  }, []) 

  useEffect(() => {
    setReview({...review, genre: JSON.stringify(genres[0])})
  }, [genres])
  
  useEffect(() => {

  })

  const uploader = () => {
    const images = [...imageFiles]
    for (let i=0; i<images.length; i++) {
      uploadImageToS3(i, images[i])
    }
    setImagesUploadedToS3(true)

  }

  const deleteImage = async (imageIndex) => {
    for (let i=0; i<review.images.length; i++) {
      if (i === imageIndex) {
        // remove from images in review state
        const newReviewImages = [...review.images]
        const newImageFiles = [...imageFiles]
        newReviewImages.splice(i, 1)
        newImageFiles.splice(i, 1)
        setReview({...review, images: newReviewImages})
        setImageFiles(newImageFiles)
      }
    }
  }

  const addImageToReviewState = e => {
    if (e.target.files[0].type.match('image.*')) {
      const image = e.target.files[0]
      setImageFiles([...imageFiles, image])
      // console.log(image)
      const reader = new FileReader();
      reader.onloadend = () => {
        const reviewImages = [...review.images, reader.result]
        setReview({...review, images: reviewImages})
      }
      reader.readAsDataURL(image)
      document.getElementById('review-image-input').value = ''
    } else {
      alert("Invalid File Type")
    }
  }
 
  const uploadImageToS3 = async () => { //this function uploads the images to s3 and returns the image s3 paths as an array
    const imagesFromS3 = []
    console.log("Image files: ", imageFiles)
    for (let i=0; i<imageFiles.length; i++) {
      try {
        const fileName = i + '-' + new Date().toString().split(" ").slice(0, 5).join("-")
        const res = await s3.uploadFile(imageFiles[i], fileName);
        imagesFromS3.push(res.location)
        document.getElementById('review-image-input').value = ''
      } catch (exception) {
          console.log(exception);
      }
    }
    return imagesFromS3
  }

  const addReview = (e) => {
    setLoading(true)
    // document.getElementById('publish-review-btn').disabled = true
    e.preventDefault()
    uploadImageToS3().then((imagesFromS3) => {
      console.log("Images from S3: ", imagesFromS3)
      setReview({...review, images: imagesFromS3})
      setImagesUploadedToS3(true)
    })
  }

  useEffect(() => {
    if (imagesUploadedToS3) { //if all the images in the previous review state have been converted to the image locations from s3
      console.log(review)
      try {
        addReviewToFireStore(review)
        .then(() => {
          setReviewCreated(true)
          setReview({
            author: '', //change to current user
            headline: '',
            genre: JSON.stringify(genres[0]),
            tag: '',
            body: '',
            rating: '',
            images: [],
          })
  
          setImagesUploadedToS3(false)
          setImageFiles([])
          window.scrollTo(0, 0);
          setLoading(false)
          setAlert({body: "Successfully Published Review", type: "inform"})
        }) 
      } catch (e) {
        setAlert({body: "Error when creating Review, Please try again", type: "error"})
      }
    }

  }, [review.images])

  useEffect(() => {
    if (reviewCreated) {
      setTimeout(() => {
        setReviewCreated(false)
      }, 4000);
    }
  }, [reviewCreated])
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        navigate('/login-signup')
      }
    })
  }, [])

  useEffect(() => {
    setReview({...review, author: currentUser?.uid})
  }, [currentUser])


  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div className='flex-1 bg-gray-100'>
        <div className='min-h-10 h-10 mb-3'>
          {
            alert &&
            <Alert content={{body: alert.body, type: alert.type}} />
          }
        </div>
        <div className='mb-10'>
          <h1 className='text-center text-3xl font-bold'>Write Review</h1>
          <p className='w-full text-center text-sm'>Tell us what you think</p>
        </div>
        <div className='flex flex-col min-h-screen w-11/12 mb-10 m-auto bg-white rounded-md p-10'>
          <form id='write-review-form' className='text-slate-500 h-full flex flex-col space-y-4' onSubmit={addReview}>
            <div className='relative w-full flex flex-col items-start h-fit font-bold'>
              {/* <label htmlFor="review-headline">Headline:</label> */}
              <input 
                value={review.headline}
                onChange={(e) => setReview({...review, headline: e.target.value})}
                type='text'
                name='headline'
                id='review-headline' 
                placeholder=' '
                className='peer w-full rounded-md p-2 px-4 font-lg border-2 border-slate-300 focus:outline-papaya focus:outline-2 focus:border-transparent placeholder-transparent'
                autoComplete='off'
                required
                autoFocus
              />
              <label 
                id='review-headline-label'
                htmlFor='review-headline'
                className='absolute left-4 -top-[10px] text-blue-500 bg-white text-sm duration-100 px-1 hover:cursor-text peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-500 peer-focus:text-sm peer-focus:text-papaya peer-focus:-top-[10px]'
              >
                Headline
              </label>
            </div>
            <div>
              <select 
                value={review.genre}
                onChange={(e) => setReview({...review, genre: e.target.value})}
                name="genre" id="review-genre" className='border-2 border-slate-300 rounded-md p-2 px-4 focus:border-papaya focus:outline-papaya text-sm'>
                {
                  genres.map((genre, i) => (
                    <option key={i} value={JSON.stringify(genre)}>{genre.title}</option>
                  ))
                }
              </select>
            </div>

            <div className='relative w-full flex flex-col items-start h-20 text-sm'>
              {/* <label htmlFor="review-headline">Headline:</label> */}
              <input 
                value={review.tag}
                onChange={(e) => setReview({...review, tag: e.target.value})}
                type='text'
                name='tag'
                id='review-tag' 
                placeholder=' '
                className='peer w-full rounded-md p-2 px-4 text-sm font-light border-2 border-slate-300 focus:outline-papaya focus:outline-2 focus:border-transparent placeholder-transparent'
                autoComplete='off'
              />
              <small>E.g. The Twilight Saga: New Moon</small>
              <label 
                id='review-tag-label'
                htmlFor='review-tag'
                className='absolute left-4 -top-[10px] text-blue-500 bg-white text-sm duration-100 px-1 hover:cursor-text peer-placeholder-shown:left-4 peer-placeholder-shown:top-[10px] peer-placeholder-shown:text-slate-500 peer-focus:text-sm peer-focus:text-papaya peer-focus:-top-[10px]'
              >
                Tag
              </label>
            </div>

            <div className='relative w-full flex flex-col items-start'>
              <textarea 
                value={review.body}
                onChange={(e) => setReview({...review, body: e.target.value})}
                name="body" id="review-body" placeholder=' ' required
                className='peer w-full h-96 p-4 border-2 border-slate-300 rounded-md focus:outline-papaya focus:outline-2 placeholder-transparent' 
              />
              <label htmlFor="review-body" className='absolute -top-[10px] left-4 text-blue-500 duration-100 bg-white px-1 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 hover:cursor-text peer-focus:text-papaya peer-focus:text-sm peer-focus:-top-[10px]'
              >
                Body
              </label>
            </div>
            <div className='relative flex-1 flex flex-col items-start w-fit'>
              <input 
                value={review.rating}
                onChange={(e) => setReview({...review, rating: Number(e.target.value)})}
                id='review-rating' name='review-rating' type='number' min={1} step={0.5} max={5} placeholder=' ' 
                className='peer font-bold border-2 border-slate-300 rounded-md p-2 w-16 placeholder-transparent focus:outline-2 focus:outline-papaya'
                required
              />
              <label 
                id='review-rating-label'
                htmlFor="review-rating"
                defaultValue={5}
                className='absolute text-xs -top-[8px] left-1/2 -translate-x-1/2 bg-white px-1 py-0 text-blue-500 peer-placeholder-shown:top-[5px] peer-placeholder-shown:text-slate-500 peer-placeholder-shown:py-2 peer-focus:-top-[8px] peer-focus:py-0 peer-focus:text-papaya duration-100'
              >
                Rating
              </label>
              <small className='w-full text-xs text-center'>1-5 stars</small>
            </div>
            <br />
            <br />

            <div className='flex flex-col mt-10 mb-16'>
              <div className='flex space-x-1 items-center justify-center'>
                <h1 className='text-xl text-center font-bold'>Add Images</h1>
                <p className='font-light text-xs m-0 h-fit'>(Optional)</p>
              </div>
              {
                selectedFile &&
                <h1 className='mb-4 text-sm w-full text-center text-sky-600'>Image staged, hit 'save' to upload image</h1>
              }
              {/* image container */}
              <div className={`flex h-[400px] p-4 rounded-md space-x-2 items-center ${review.images.length > 0 ?  `justify-center` : ``}`}>
                {
                  review.images.map((image, key) => (
                    <div key={key} className='group border-2 border-slate-400 relative flex items-center w-[250px] h-[300px] bg-slate-100 rounded-md overflow-hidden'>
                      <div className='absolute flex items-center justify-center top-0 -z-1 group-hover:z-10 backdrop-blur-sm hover:cursor-pointer w-full h-full'>
                        <span className='text-red-600 transform hover:scale-110 duration-300 rounded-full'><RemoveOutlinedIcon onClick={() => deleteImage(key)} className='' sx={{ fontSize: 60 }} /></span>
                      </div>
                      <img src={image} alt="uploaded review image" className='review-image relative object-cover w-full' />
                    </div>        
                  ))
                }
                { 
                  review.images.length < 3 &&
                  <div className='flex w-[250px] h-[300px] border-2 border-slate-100 bg-slate-100 opacity-100 items-center justify-center rounded-md'>
                    <label htmlFor="review-image-input" className='w-fit hover:cursor-pointer transform hover:scale-110 duration-300 active:text-red'><AddOutlinedIcon className={`${!selectedFile ? `text-papaya` : `text-moss opacity-70`}`} sx={{ fontSize: 60 }} /></label>
                  </div>
                }


              </div>
              <input type="file" accept="image/*" id='review-image-input' className='hidden' onChange={addImageToReviewState} />
  {/*             
              <div className='flex flex-col items-center justify-center'>
                <button onClick={(e) => {e.preventDefault();uploadImage(selectedFile)}} className={`w-20 border-2 text-white bg-sky-600 border-sky-600 p-2 focus:outline-papaya disabled:opacity-70 ${!selectedFile ? `hidden` : `block` } mb-4`}>Save</button>
              </div> */}
            </div>
            <br />
            <br />
            <br />
            <div className='flex w-full items-center justify-center space-x-2'>

                <button id="publish-review-btn" type='submit' disabled={loading ? true : false} className='border-2 border-papaya bg-papaya w-80 h-20 text-white font-bold p-2 focus:outline-papaya'>
                  {/* <span className='flex items-center w-fit m-auto'> */}
                  {loading ? 
                    <span className='flex items-center w-fit m-auto'>
                      <LoadingAnimation className="mr-6" type={'spinningBubbles'} color={'white'} height={'40px'} width={'40px'} />
                      <p>Publishing...</p>
                    </span>
                    :
                    <span className='flex items-center w-fit m-auto'>
                      <p>Publish</p>
                      <PublishOutlinedIcon />
                    </span>
                  }
                </button>
            </div>
          </form>
          {/* <button onClick={addReviewToFireStore2}>uploader</button> */}
        </div>
      </div>
    </div>
  )
}

export default WriteReview 