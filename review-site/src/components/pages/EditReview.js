import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getReviewFromFirestore, updateReviewInFirestore } from '../../firebase'
import AdSpace from '../AdSpace'
import Alert from '../Alert'
import { addReviewToFireStore, getGenresFromFireStore } from '../../firebase'
import ReactS3Client from 'react-aws-s3-typescript';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import LoadingAnimation from 'react-loading';



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

const EditReview = () => {
  const [review, setReview] = useState(null)
  const [genres, setGenres] = useState([])
  const { id } = useParams()
  const [canEdit, setCanEdit] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [alert, setAlert] = useState(null)
  const auth = getAuth() 
  const navigate = useNavigate();

  const [defaultGenre, setDefaultGenre] = useState('') 
  const [deletedImages, setDeletedImages] = useState('')

  const originalImages = useRef(null)
  const [unchangedImages, setUnchangedImages] = useState([]) // keeps track of the images from the review that have not been deleted/replaced by user 

  const [imageFiles, setImageFiles] = useState([null, null, null])

  const [imagesUploadedToS3, setImagesUploadedToS3] = useState(false)

  const [reviewUpdated, setReviewUpdated] = useState(false)

  useEffect(() => {
    getReviewFromFirestore(id).then((review) => {
      const rev = {...review}
      rev.genre = JSON.stringify(rev.genre)
      setReview(rev)}
      )
  }, [])

  useEffect(() => { //keep a snapshot of the original images in the review to check against to determine the images to upload to s3 if there are any new ones
    if (!originalImages.current && review) {
      const origImages = [...review?.images]
      originalImages.current = origImages
      setUnchangedImages(origImages)
      setImageFiles(review.images)
    }
    // console.log(originalImages.current)
  }, [review])

  useEffect(() => {
    getGenresFromFireStore().then((genres) => setGenres(genres))
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        navigate('/') //maybe change this
      }
    })
  }, [])
  
  useEffect(() => {
    setCanEdit(currentUser && review && (currentUser?.uid === review?.author?.uid))
  }, [currentUser, review])

  useEffect(() => {
    // console.log(canEdit)
    if (currentUser && review && !canEdit) {
      navigate('/')
    }
  }, [canEdit])


  const unstageImage = (key) => { //user chooses to remove image but has not published changes yet
    const newImages = review.images
    const newImageFiles = [...imageFiles]
    const imageToDel = newImages[key]
    newImages.splice(key, 1)


    setReview({...review, images: newImages})
    setDeletedImages([...deletedImages, imageToDel])
    setUnchangedImages(newImages)
    setImageFiles(newImageFiles)
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
    for (let i=0; i<imageFiles.length; i++) {
      console.log('ori: ', originalImages)
      if (originalImages.current.indexOf(imageFiles[i]) === -1) { //if not in the original images i.e. if its a new image to be added to the store
        try {
          const fileName = i + '-' + new Date().toString().split(" ").slice(0, 5).join("-")

          const res = await s3.uploadFile(imageFiles[i], fileName);
          imagesFromS3.push(res.location)
          document.getElementById('review-image-input').value = ''
        } catch (exception) {
            console.log(exception);
        }
      }
    }
    for (let i=0; i<originalImages.length; i++) {
      if (review?.images.indexOf(originalImages[i]) === -1) { //if an original image is not in the state images then delete from server

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
      const newImages = [...unchangedImages, ...imagesFromS3] // merge new images and existing images
      setReview({...review, images: newImages})
      setImagesUploadedToS3(true)
    })
  }

  useEffect(() => {
    if (imagesUploadedToS3) {
      console.log("New Images: ", review.images)
      try {
        updateReviewInFirestore({...review, reviewId: id})
        .then(() => {
          // setReviewCreated(true)
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
          cleanUpImagesInS3() // remove images from s3 that were not kept in the edit
          setReviewUpdated(true)
        }) 
      } catch (e) {
        setAlert({body: "Error when creating Review, Please try again", type: "error"})
      }
    }
  }, [imagesUploadedToS3])

  const cleanUpImagesInS3 = async () => {
    for (let image of originalImages.current) {
      if (review?.images.indexOf(image) === -1) { //image was deleted/replaced and should be deleted in s3
        const imageSplit = image.split('/')
        const fileName = imageSplit[imageSplit.length-1]
        const filepath = config.dirName+'/'+fileName;
        try {
            await s3.deleteFile(filepath);
        } catch (exception) {
            console.log(exception);
        }
      }
    }
  }

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
          <h1 className='text-center text-3xl font-bold'>Edit Review</h1>
        </div>
        <div className='flex flex-col min-h-screen w-11/12 mb-10 m-auto bg-white rounded-md p-10'>
          <form id='write-review-form' className='text-slate-500 h-full flex flex-col space-y-4' onSubmit={addReview}>
            <div className='relative w-full flex flex-col items-start h-fit font-bold'>
              {/* <label htmlFor="review-headline">Headline:</label> */}
              <input 
                value={review ? review?.headline : ''}
                onChange={(e) => setReview({...review, headline: e.target.value})}
                type='text'
                name='headline'
                id='review-headline' 
                placeholder=' '
                className='peer w-full rounded-md p-2 px-4 font-lg border-2 border-slate-300 focus:outline-papaya focus:outline-2 focus:border-transparent placeholder-transparent'
                autoComplete='off'
                required
                autoFocus
                maxLength={100}
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
                value={review ? review?.genre : ''}
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
                value={review ? review?.tag : ''}
                onChange={(e) => setReview({...review, tag: e.target.value})}
                type='text'
                name='tag'
                id='review-tag' 
                placeholder=' '
                className='peer w-full rounded-md p-2 px-4 text-sm font-light border-2 border-slate-300 focus:outline-papaya focus:outline-2 focus:border-transparent placeholder-transparent'
                autoComplete='off'
                maxLength={50}
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
                value={review ? review?.body : ''}
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
                value={review ? review?.rating : ''}
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
              <div className={`flex h-[400px] p-4 rounded-md space-x-2 items-center ${review?.images.length > 0 ?  `justify-center` : ``}`}>
                {
                  review?.images.map((image, key) => (
                    <div key={key} className='group border-2 border-slate-400 relative flex items-center w-[250px] h-[300px] bg-slate-100 rounded-md overflow-hidden'>
                      <div className='absolute flex items-center justify-center top-0 -z-1 group-hover:z-10 backdrop-blur-sm hover:cursor-pointer w-full h-full'>
                        <span className='text-red-600 transform hover:scale-110 duration-300 rounded-full' onClick={() => unstageImage(key)}><RemoveOutlinedIcon className='' sx={{ fontSize: 60 }} /></span>
                      </div>
                      <img src={image} alt="uploaded review image" className='review-image relative object-cover w-full' />
                    </div>        
                  ))
                }
                { 
                  review?.images.length < 3 &&
                  <div className='flex w-[250px] h-[300px] border-2 border-slate-100 bg-slate-100 opacity-100 items-center justify-center rounded-md'>
                    <label htmlFor="review-image-input" className='w-fit hover:cursor-pointer transform hover:scale-110 duration-300 active:text-red'><AddOutlinedIcon className={`${!selectedFile ? `text-papaya` : `text-moss opacity-70`}`} sx={{ fontSize: 60 }} /></label>
                  </div>
                }


              </div>
              <input type="file" accept="image/*" id='review-image-input' className='hidden'  onChange={addImageToReviewState} />
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
                      <p>Saving Changes...</p>
                    </span>
                    :
                    <span className='flex items-center w-fit m-auto'>
                      <p>Update</p>
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

export default EditReview