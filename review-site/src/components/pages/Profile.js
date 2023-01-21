import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addToUserFollowers, getAuthorReviews, getUserFromFirestore, removeFromUserFollowers, updateUserProfilePic } from '../../firebase'
import AdSpace from '../AdSpace'
import profileWallpaper from '../../assets/profile-wallpaper.jfif'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { UserCircleIcon } from '@heroicons/react/24/solid'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth'
import defaultProfileImage from '../../assets/default-profile-image.png'
import Review from '../Review'
import ReactS3Client from 'react-aws-s3-typescript';

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

const Profile = () => {
  const { id } = useParams()

  const [profileUser, setProfileUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isProfileOwner, setIsProfileOwner] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [reviews, setReviews] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [stagedProfileImage, setStagedProfileImage] = useState(null)
  const [newProfileImage, setNewProfileImage] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
  }, [])


  useEffect(() => {
    if (profileUser) {
      setIsProfileOwner(profileUser?.uid === currentUser?.uid)
      setIsFollowing(profileUser?.followers.indexOf(currentUser?.uid) !== -1)
    }

  }, [currentUser, profileUser])

  useEffect(() => {
    console.log('is profile owner? ', isProfileOwner)
  }, [isProfileOwner])

  // gets the user that corresponds to the profile that the currently logged in user wants to see
  useEffect(() => {
    getUserFromFirestore(id).then(user => setProfileUser(user))
  }, [])

  // gets profile owners reviews
  useEffect(() => {
    if (profileUser) {
      getAuthorReviews(profileUser?.uid).then(reviews => setReviews(reviews))
      setFollowers(profileUser?.followers.length)
      setFollowing(profileUser?.following.length)
    }
  }, [profileUser])

  useEffect(() => {
    console.log('reviews: ', reviews)
  }, [reviews])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleFollow = () => {
    setFollowers(followers => followers+1)
    try {
      addToUserFollowers(profileUser?.uid, currentUser?.uid)
      setIsFollowing(true)
    } catch (e) {
      console.log("Could not follow user")
    }
  }

  const handleUnfollow = () => {
    setFollowers(followers => followers-1)
    try {
      removeFromUserFollowers(profileUser?.uid, currentUser?.uid)
      setIsFollowing(false)
    } catch (e) {
      console.log("Could not unfollow user")
    }

  }

  const addImageToReviewState = e => {
    if (e.target.files[0].type.match('image.*')) {
      const image = e.target.files[0]
      console.log(image)
      const reader = new FileReader();
      reader.onloadend = () => {
        setStagedProfileImage(reader.result)
        setNewProfileImage(image)
      }
      reader.readAsDataURL(image)
      document.getElementById('profile-image-input').value = ''
    } else {
      alert("Invalid File Type")
    }
  }

  const uploadImageToS3 = async () => { //this function uploads the profile image to s3 and returns the image s3 path
    try {
      const fileName = profileUser?.userName + '-profile-pic-' + new Date().toString().split(" ").slice(0, 5).join("-")
      const res = await s3.uploadFile(newProfileImage, fileName);
      document.getElementById('profile-image-input').value = ''
      return res.location
    } catch (exception) {
        console.log(exception);
    }
    return ''
  }

  const handleProfilePicUpdate = async () => {
    const profilePicPath = await uploadImageToS3()
    if (profilePicPath !== '') {
      await updateUserProfilePic(profileUser?.uid, profilePicPath)
      updateProfile(auth.currentUser, {
        photoURL: profilePicPath,
      })
      getUserFromFirestore(profileUser?.uid).then(user => setProfileUser(user))
      setStagedProfileImage(null)
      setNewProfileImage(null)
    }
  }


  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div className='flex-1 min-h-screen'>
        {/* profile background */}
        <div className='group flex items-center justify-center h-48'>
          <img src={profileUser?.profileBgImageURL ? profileUser?.profileBgImageURL : profileWallpaper} alt="profile wallpaper"
            className='relative z-1 h-full w-full object-cover group-hover:opacity-70 group-hover:cursor-pointer'
          />
          {
            isProfileOwner &&
            <AddAPhotoOutlinedIcon className='absolute text-transparent group-hover:text-slate-500' />
          }
        </div>
        {/* profile content */}
        <div className='flex min-h-screen'>
          <div className='flex flex-col items-center min-h-screen basis-1/4 border-r-2 border-slate-100'>
            <div className='relative flex items-center justify-center h-48 w-48 -mt-24 rounded-full bg-white'>
              <div className='relative group hover:cursor-pointer flex items-center justify-center rounded-full h-44 w-44 bg-gray-200 overflow-hidden'>
                {
                  isProfileOwner &&
                  stagedProfileImage ?
                  <>
                    <div className='absolute hidden group-hover:block group-hover:z-10 w-full h-full'>
                      <input id='profile-image-input' className="hidden" type="file" accept="image/*" onChange={addImageToReviewState} />
                      <label htmlFor='profile-image-input' className="w-full h-full flex items-center justify-center hover:cursor-pointer"><AddAPhotoOutlinedIcon className='text-papaya' fontSize='large' /></label>
                    </div>
                    <div className='relative group-hover:z-0 group-hover:opacity-20'>
                      <img id='profile-pic' src={stagedProfileImage} alt='profile picture' className='object-cover'/>
                    </div>
                  </>
                  :
                  <>
                    <div className='absolute hidden group-hover:block group-hover:z-10 w-full h-full'>
                      <input id='profile-image-input' className="hidden" type="file" accept="image/*" onChange={addImageToReviewState} />
                      <label htmlFor='profile-image-input' className="w-full h-full flex items-center justify-center hover:cursor-pointer"><AddAPhotoOutlinedIcon className='text-papaya' fontSize='large' /></label>
                    </div>
                    <div className='relative group-hover:z-0 group-hover:opacity-20 h-full w-full'>
                      <img id='profile-pic' src={`${profileUser?.photoURL ? profileUser?.photoURL : defaultProfileImage}`} alt='profile picture' className='object-cover'/>
                    </div>
                  </>
                }
              </div>
            </div>
              {
                stagedProfileImage &&
                <button onClick={handleProfilePicUpdate} className='bg-emerald-400 px-2 text-white rounded-sm hover:bg-emerald-300'>Update</button>
              }
            <div className='pt-2'>
              <h1 className='font-bold text-xl text-center'>{profileUser?.userName}</h1>
              <p className='font-light text-sm text-center'>Joined {profileUser?.dateJoined?.toDate().toDateString()}</p>
              <div className='flex mt-5 space-x-4'>
                <div className='basis-1/3 text-xs'>
                  <p className='text-center'>{reviews?.length}</p>
                  <p className='text-center'>Reviews</p>
                </div>
                <div className='basis-1/3 text-xs'>
                  <p className='text-center'>{followers}</p>
                  <p className='text-center'>Followers</p>
                </div>
                <div className='basis-1/3 text-xs'>
                  <p className='text-center'>{following}</p>
                  <p className='text-center'>Following</p>
                </div>
              </div>
              {
                !isFollowing ?
                <button className='w-full bg-papaya mt-4 rounded-sm text-white text-sm py-2' onClick={handleFollow}>Follow +</button>
                :
                <button className='w-full bg-papaya mt-4 rounded-sm text-white text-sm py-2' onClick={handleUnfollow}>Unfollow</button>
                
              }
            </div>
            <div className='mt-10'>
              <h1>Contact</h1>
            </div>
          </div>
          <div className='min-h-screen basis-3/4 bg-gray-100'>
            <h1 className='font-bold text-center text-xl pt-4'>User reviews</h1>

            <div className='flex flex-col justify-center'>
              {
                reviews.length ?
                reviews?.map((review, i) => (
                  <div key={review.id + i} className='-mb-10 scale-90'>
                    <Review id={i} review={review}/>
                  </div>
                ))
                :
                <h1>No reviews</h1>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile