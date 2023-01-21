import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addToUserFollowers, getAuthorReviews, getUserFromFirestore, removeFromUserFollowers, updateUserBackgroundImage, updateUserProfilePic } from '../../firebase'
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
  const [stagedBackgroundImage, setStagedBackgroundImage] = useState(null)
  const [newBackgroundImage, setNewBackgroundImage] = useState(null)
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

  const addProfilePic = e => {
    if (e.target.files[0].type.match('image.*')) {
      const image = e.target.files[0]
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

  const addBackgroundImage = e => {
    if (e.target.files[0].type.match('image.*')) {
      const image = e.target.files[0]
      const reader = new FileReader();
      reader.onloadend = () => {
        setStagedBackgroundImage(reader.result)
        setNewBackgroundImage(image)
      }
      reader.readAsDataURL(image)
      document.getElementById('background-image-input').value = ''
    } else {
      alert("Invalid File Type")
    }
  }

  const uploadBackgroundImageToS3 = async () => { //this function uploads the profile image to s3 and returns the image s3 path
    try {
      const fileName = profileUser?.userName + '-background-image-' + new Date().toString().split(" ").slice(0, 5).join("-")
      const res = await s3.uploadFile(newBackgroundImage, fileName);
      document.getElementById('background-image-input').value = ''
      return res.location
    } catch (exception) {
        console.log(exception);
    }
    return ''
  }

  const handleBackgroundImageUpdate = async () => {
    const existingPic = profileUser?.profileBgImageURL //picture that was the background image before the update if there was one
    const bgImagePath = await uploadBackgroundImageToS3()
    if (bgImagePath !== '') {
      await updateUserBackgroundImage(profileUser?.uid, bgImagePath)
      // updateProfile(auth.currentUser, {
      //   photoURL: profilePicPath,
      // })
      getUserFromFirestore(profileUser?.uid).then(user => setProfileUser(user))
      setStagedBackgroundImage(null)
      setNewBackgroundImage(null)
    }

    if (existingPic) {
      cleanUpBackgroundImageInS3()
    }
  }

  const uploadProfilePicToS3 = async () => { //this function uploads the profile image to s3 and returns the image s3 path
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
    const existingPic = currentUser?.photoURL //picture that was the profile pic before the update if there was one
    const profilePicPath = await uploadProfilePicToS3()
    if (profilePicPath !== '') {
      await updateUserProfilePic(profileUser?.uid, profilePicPath)
      updateProfile(auth.currentUser, {
        photoURL: profilePicPath,
      })
      getUserFromFirestore(profileUser?.uid).then(user => setProfileUser(user))
      setStagedProfileImage(null)
      setNewProfileImage(null)
    }

    if (existingPic) {
      cleanUpProfilePicInS3()
    }
  }

  const cleanUpProfilePicInS3 = async () => {
    const imageSplit = currentUser?.photoURL.split('/')
    const fileName = imageSplit[imageSplit.length-1]
    const filepath = config.dirName+'/'+fileName;
    try {
        await s3.deleteFile(filepath);
    } catch (exception) {
        console.log(exception);
    }
  }

  
  const cleanUpBackgroundImageInS3 = async () => {
    const imageSplit = profileUser?.profileBgImageURL.split('/')
    const fileName = imageSplit[imageSplit.length-1]
    console.log(fileName)
    const filepath = config.dirName+'/'+fileName;
    try {
        await s3.deleteFile(filepath);
    } catch (exception) {
        console.log(exception);
    }
  }


  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div className='flex-1 min-h-screen'>
        {/* profile background */}
        <div className='group flex justify-center items-center relative h-48 w-full'>
          {
            isProfileOwner &&
            stagedBackgroundImage ?
            <>
              <div className='absolute flex items-center justify-center w-full h-full hover:cursor-pointer'>
                <input id='background-image-input' type="file" className='hidden' onChange={addBackgroundImage} />
                <label htmlFor="background-image-input" className='relative flex items-center justify-center w-full h-full hover:cursor-pointer'>
                  <AddAPhotoOutlinedIcon className='peer text-papaya absolute group-hover:z-10' fontSize='large' />
                  <img src={stagedBackgroundImage} alt="profile wallpaper"
                    className='peer-hover:opacity-70 relative h-full w-full object-cover'
                  />
                </label>
                <button onClick={handleBackgroundImageUpdate} className='absolute bottom-10 bg-emerald-400 px-2 text-white rounded-sm hover:bg-emerald-300'>Update</button>
              </div>
            </>
            :
            <>
              <div className='absolute flex items-center justify-center w-full h-full hover:cursor-pointer'>
                <input id='background-image-input' type="file" className='hidden' onChange={addBackgroundImage} />
                <label htmlFor="background-image-input" className='relative flex items-center justify-center w-full h-full hover:cursor-pointer'>
                  <AddAPhotoOutlinedIcon className='peer text-papaya absolute group-hover:z-10' fontSize='large' />
                  <img src={profileUser?.profileBgImageURL ? profileUser?.profileBgImageURL : profileWallpaper} alt="profile wallpaper"
                    className='peer-hover:opacity-70 hover:opacity-70 relative h-full w-full object-cover'
                  />
                </label>
              </div>
            </>
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
                      <input id='profile-image-input' className="hidden" type="file" accept="image/*" onChange={addProfilePic} />
                      <label htmlFor='profile-image-input' className="w-full h-full flex items-center justify-center hover:cursor-pointer"><AddAPhotoOutlinedIcon className='text-papaya' fontSize='large' /></label>
                    </div>
                    <div className='relative flex items-center justify-center group-hover:z-0 group-hover:opacity-50 h-full w-full'>
                      <img id='profile-pic' src={stagedProfileImage} alt='profile picture' className='h-full w-full object-cover'/>
                    </div>
                  </>
                  :
                  <>
                    <div className='absolute hidden group-hover:block group-hover:z-10 w-full h-full'>
                      <input id='profile-image-input' className="hidden" type="file" accept="image/*" onChange={addProfilePic} />
                      <label htmlFor='profile-image-input' className="w-full h-full flex items-center justify-center hover:cursor-pointer"><AddAPhotoOutlinedIcon className='text-papaya' fontSize='large' /></label>
                    </div>
                    <div className='relative flex items-center justify-center group-hover:z-0 group-hover:opacity-50 h-full w-full'>
                      <img id='profile-pic' src={`${profileUser?.photoURL ? profileUser?.photoURL : defaultProfileImage}`} alt='profile picture' className='h-full w-full object-cover'/>
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
                !isProfileOwner &&
                <>
                {
                  !isFollowing ?
                  <button className='w-full bg-papaya mt-4 rounded-sm text-white text-sm py-2' onClick={handleFollow}>Follow +</button>
                  :
                  <button className='w-full bg-papaya mt-4 rounded-sm text-white text-sm py-2' onClick={handleUnfollow}>Unfollow</button>
                }
                </>
                
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
                <div className='mt-20'>
                  <h1 className='text-center'>-No reviews-</h1>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile