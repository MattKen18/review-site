import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addToUserFollowers, getAuthorReviews, getUserFromFirestore, getUserLinks, removeFromUserFollowers, updateUserBackgroundImage, updateUserProfilePic, updateuserProfileWithAbout } from '../../firebase'
import AdSpace from '../AdSpace'
import profileWallpaper from '../../assets/profile-wallpaper.jfif'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/solid'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth'
import defaultProfileImage from '../../assets/default-profile-image.png'
import Review from '../Review'
import ReactS3Client from 'react-aws-s3-typescript';
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, selectUser, setUser, updateUser } from '../../slices/userSlice'
import linkIcons from '../../assets/social-media-icons/icons'
import AddLinkModal from '../AddLinkModal'
import $ from 'jquery'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Alert from '../Alert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ChangePwordModal from '../ChangePwordModal'
import ChangeUsernameModal from '../ChangeUsernameModal'

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

  const [profileUser, setProfileUser] = useState(null) //user from firestore
  // const [currentUser, setCurrentUser] = useState(null)
  const [isProfileOwner, setIsProfileOwner] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [profileUserFollowers, setProfileUserFollowers] = useState([])
  const [userFollowing, setUserFollowing] = useState([])
  const [reviews, setReviews] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [stagedProfileImage, setStagedProfileImage] = useState(null)
  const [stagedBackgroundImage, setStagedBackgroundImage] = useState(null)
  const [newBackgroundImage, setNewBackgroundImage] = useState(null)
  const [newProfileImage, setNewProfileImage] = useState(null)
  const [userLinks, setUserLinks] = useState([])
  const [linksEmpty, setLinksEmpty] = useState(false)
  const [shownModals, setShownModals] = useState({
    addLink: false,
    changePword: false,
    changeUsername: false,
  })

  const [linksShown, setLinksShown] = useState(true)
  const [alert, setAlert] = useState(null)

  const [about, setAbout] = useState('')
  const [typingAbout, setTypingAbout] = useState(false)
  const [editAbout, setEditAbout] = useState(false)

  const [spectatorView, setSpectatorView] = useState(false)

  const auth = getAuth()

  const currentUser = useSelector(selectUser)
  const dispatch = useDispatch()


  const linkColors = {
    'facebook': '#a5b4fc',
    'instagram': '#f9a8d4',
    'gmail': '#e7e5e4',
    'linkedIn': '#C5ECFF',
    'tiktok': '#1f2937',
    'twitter': '#7dd3fc',
    'youtube': '#FCDCDC',
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // setCurrentUser(user)
        getUserFromFirestore(user.uid).then(user => {
          // user.dateJoined = user.dateJoined.toDate().toDateString()
          dispatch(setUser(user))
        })
      } else {
        dispatch(resetUser())
        // setCurrentUser(null)
      }
    })
  }, [])


  useEffect(() => {
    if (profileUser) {
      setIsProfileOwner(profileUser?.uid === currentUser?.uid)
    }
    
  }, [currentUser, profileUser])

  useEffect(() => {
    // console.log('is profile owner? ', isProfileOwner)
  }, [isProfileOwner])
  
  // gets the user that corresponds to the profile that the currently logged in user wants to see
  useEffect(() => {
    getUserFromFirestore(id).then(user => setProfileUser(user))
  }, [])
  
  // gets profile owners reviews
  useEffect(() => {
    if (profileUser) {
      getAuthorReviews(profileUser?.uid).then(reviews => setReviews(reviews))
      setFollowers(Object.keys(profileUser?.followers).length)
      setFollowing(Object.keys(profileUser?.following).length)
      setAbout(profileUser?.about)
      setProfileUserFollowers(convertUserFollowers(profileUser.followers))
    }
  }, [profileUser])
  
  useEffect(() => {
    if (profileUserFollowers.length) {
      setIsFollowing(profileUserFollowers?.indexOf(currentUser?.uid) !== -1)
      console.log(profileUserFollowers)
    }
  }, [profileUserFollowers])



  // converts the profile followers from an object to an array of followerIds
  const convertUserFollowers = (followers) => {
    const followerIds = []

    /*
      follower => {
        followerId: ....,
        timestamp: ...
      }
    */
    for (let follower in followers) {
      followerIds.push(follower)
    }

    return followerIds
  } 

  useEffect(() => {
    // console.log('reviews: ', reviews)
  }, [reviews])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleFollow = () => {
    setFollowers(followers => followers+1)
    try {
      addToUserFollowers(profileUser?.uid, currentUser?.uid) //add current user to profile user/owners followers list in firebase
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
      console.log("Invalid file type")
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
    const existingPic = currentUser?.profileBgImageURL //picture that was the background image before the update if there was one
    const bgImagePath = await uploadBackgroundImageToS3()
    if (bgImagePath !== '') {
      await updateUserBackgroundImage(currentUser?.uid, bgImagePath)

      // getUserFromFirestore(profileUser?.uid).then(user => setProfileUser(user))
      dispatch(updateUser({'profileBgImageURL': bgImagePath}))
      setStagedBackgroundImage(null)
      setNewBackgroundImage(null)
      setAlert({body: "Succesfully updated Background Image!", type: "success"})
      
      setTimeout(() => {
        setAlert(null)
      }, 3000);

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
      await updateUserProfilePic(currentUser?.uid, profilePicPath)
      updateProfile(auth.currentUser, {
        photoURL: profilePicPath,
      })
      // getUserFromFirestore(profileUser?.uid).then(user => setProfileUser(user))
      dispatch(updateUser({'photoURL': profilePicPath}))
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
    const filepath = config.dirName+'/'+fileName;
    try {
        await s3.deleteFile(filepath);
    } catch (exception) {
        console.log(exception);
    }
  }

  useEffect(() => {
    if (profileUser) {
      getUserLinks(profileUser?.uid).then(
        links => setUserLinks(links)
      )
    }
  }, [profileUser])


  useEffect(() => {
    setLinksEmpty(checkLinksEmpty())
  }, [userLinks])

  useEffect(() => {
    if (!linksEmpty) {
      for (let link of userLinks) {
        if (link[1].length) {
          const linkObj = document.getElementById(`${link[0]}-link-logo`)
          linkObj.style.backgroundColor = linkColors[link[0]]
        }
      }
    }
  }, [linksEmpty])

  const preventScroll = () => {
    window.scroll(0, 0)
  }
  
  const easyCloseModal = () => {
    window.removeEventListener('scroll', preventScroll)
    document.body.style.overflow = 'scroll'
    setShownModals({
      addLink: false,
      changePword: false,
      changeUsername: false,
    })
    // setShowAddLinkModal(false)
  }

  const hideModalAfterUpdate = () => {
    setShownModals({
      addLink: false,
      changePword: false,
      changeUsername: false,
    })
    window.location.reload()
    // setShowAddLinkModal(false)
  }


  const toggleLinks = () => {
    setLinksShown(shown => !shown)
    $('#links-container').slideToggle()
  }

  useEffect(() => {
    if (linksShown) {
      $('#links-container').slideDown()
    }
  }, [])

  // when user enters content into the about textarea
  const updateAbout = (val) => {
    setAbout(val)
    if (val === profileUser?.about) {
      setTypingAbout(false)
    } else {
      setTypingAbout(true)
    }
  }

  // saving the changes made to the about textarea
  const saveAbout = (e) => {
    e.preventDefault()
    updateuserProfileWithAbout(profileUser?.uid, about.trim()).then(success => {
      if (success) {
        setAlert({body: "Successfully updated User About", type: "success"})
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      } else {
        setAlert({body: "Error updating User About", type: "error"})
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      }
    }
    )
  }

  // checks if the links are the default values ""
  const checkLinksEmpty = () => {
    for (let link of userLinks) {
      if (link[1].trim() !== '') {
        return false
      }
    }
    return true
  }

  return (
    <div id="profile-wrapper" className='flex'>
      {
        shownModals.addLink ?
          <AddLinkModal user={profileUser} links={userLinks} close={hideModalAfterUpdate} easyClose={easyCloseModal} />
          :
        shownModals.changePword ?
          <ChangePwordModal user={profileUser} close={hideModalAfterUpdate} easyClose={easyCloseModal} />
          :
        shownModals.changeUsername ?
          <ChangeUsernameModal user={profileUser} close={hideModalAfterUpdate} easyClose={easyCloseModal} />
          :
          <></>
        }

      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>
      <div className='relative flex-1 min-h-screen'>
        {/* profile background */}
        <div className='group flex justify-center items-center relative h-48 w-full'>
          {
            isProfileOwner && !spectatorView ?
            <>
             {
              stagedBackgroundImage ?
              <>
                <div className='absolute flex items-center justify-center w-full h-full hover:cursor-pointer'>
                  <input id='background-image-input' type="file" className='hidden' onChange={addBackgroundImage} />
                  <label htmlFor="background-image-input" className='relative flex items-center justify-center w-full h-full hover:cursor-pointer'>
                    <span className='peer text-white absolute group-hover:z-10 w-16 h-16 bg-black rounded-full p-2 flex items-center justify-center'>
                      <AddPhotoAlternateOutlinedIcon className='' fontSize='large' />
                    </span>                  
                    <img src={stagedBackgroundImage} alt="profile wallpaper"
                      className='peer-hover:opacity-70 relative h-full w-full object-cover'
                    />
                  </label>
                  <br />
                  <button onClick={handleBackgroundImageUpdate} className='absolute bottom-8 bg-emerald-400 px-2 text-white rounded-sm hover:bg-emerald-300'>Update</button>
                </div>
              </>
              :
              <>
              <div className='absolute flex items-center justify-center w-full h-full hover:cursor-pointer'>
                <input id='background-image-input' type="file" className='hidden' onChange={addBackgroundImage} />
                <label htmlFor="background-image-input" className='relative flex items-center justify-center w-full h-full hover:cursor-pointer'>
                  <span className='peer text-white absolute group-hover:z-10 w-16 h-16 bg-black rounded-full p-2 flex items-center justify-center'>
                    <AddPhotoAlternateOutlinedIcon className='' fontSize='large' />
                  </span>
                  {
                    <img src={currentUser?.profileBgImageURL ? currentUser?.profileBgImageURL : profileWallpaper} alt="profile wallpaper"
                      className='peer-hover:opacity-70 hover:opacity-70 relative h-full w-full object-cover'
                    />
                  }
                </label>
              </div>
              </>
             }
            </>
            :
            spectatorView ?
            <>
              <div className='absolute flex items-center justify-center w-full h-full'>
                <img src={profileUser?.profileBgImageURL ? profileUser?.profileBgImageURL : profileWallpaper} alt="profile wallpaper"
                  className='relative h-full w-full object-cover'
                />
              </div>
            </>
            :
            <>
              <div className='absolute flex items-center justify-center w-full h-full'>
                <img src={profileUser?.profileBgImageURL ? profileUser?.profileBgImageURL : profileWallpaper} alt="profile wallpaper"
                  className='relative h-full w-full object-cover'
                />
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
                  isProfileOwner && !spectatorView?
                  <>
                    {
                      stagedProfileImage ?
                      <>
                        <div className='absolute hidden group-hover:block group-hover:z-10 w-full h-full'>
                          <input id='profile-image-input' className="hidden" type="file" accept="image/*" onChange={addProfilePic} />
                          <label htmlFor='profile-image-input' className="w-full h-full flex items-center justify-center hover:cursor-pointer">
                            <span className='peer text-white absolute group-hover:z-10 w-10 h-10 bg-black rounded-full p-2 flex items-center justify-center'>
                              <AddPhotoAlternateOutlinedIcon className='' fontSize='medium' />
                            </span>
                          </label>
                        </div>
                        <div className='relative flex items-center justify-center group-hover:z-0 group-hover:opacity-50 h-full w-full'>
                          <img id='profile-pic' src={stagedProfileImage} alt='profile picture' className='h-full w-full object-cover'/>
                        </div>
                      </>
                      :
                      <>
                        <div className='absolute hidden group-hover:block group-hover:z-10 w-full h-full'>
                          <input id='profile-image-input' className="hidden" type="file" accept="image/*" onChange={addProfilePic} />
                          <label htmlFor='profile-image-input' className="w-full h-full flex items-center justify-center hover:cursor-pointer">
                            <span className='peer text-white absolute group-hover:z-10 w-10 h-10 bg-black rounded-full p-2 flex items-center justify-center'>
                              <AddPhotoAlternateOutlinedIcon className='' fontSize='medium' />
                            </span>
                          </label>
                        </div>
                        <div className='relative flex items-center justify-center group-hover:z-0 group-hover:opacity-50 h-full w-full'>
                          <img id='profile-pic' src={`${currentUser?.photoURL ? currentUser?.photoURL : defaultProfileImage}`} alt='profile picture' className='h-full w-full object-cover'/>
                        </div>
                      </>
                    }
                  </>
                  :
                  spectatorView ?
                  <>
                    <div className='relative flex items-center justify-center group-hover:z-0 h-full w-full hover:cursor-default'>
                      <img id='profile-pic' src={`${profileUser?.photoURL ? profileUser?.photoURL : defaultProfileImage}`} alt='profile picture' className='h-full w-full object-cover'/>
                    </div>
                  </>
                  :
                  <>
                    <div className='relative flex items-center justify-center group-hover:z-0 h-full w-full hover:cursor-default'>
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
              <p className='font-light text-sm text-center'>Joined {profileUser?.dateJoined}</p>
              <div className='flex mt-5 space-x-4'>
                <div className='basis-1/3 text-xs'>
                  <p className='text-center font-bold'>{reviews?.length}</p>
                  <p className='text-center'>Reviews</p>
                </div>
                <div className='basis-1/3 text-xs'>
                  <p className='text-center font-bold'>{followers}</p>
                  <p className='text-center'>Followers</p>
                </div>
                <div className='basis-1/3 text-xs'>
                  <p className='text-center font-bold'>{following}</p>
                  <p className='text-center'>Following</p>
                </div>
              </div>
              {
                spectatorView ?
                <button className='w-full bg-papaya mt-4 rounded-sm text-white text-sm py-2 disabled:cursor-not-allowed' disabled={true} >Follow +</button>
                :
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
            <div className='w-full mt-10 px-8 flex flex-col justify-center space-y-8'>
              {/* about section */}
              <div className='flex flex-col'>
                <h1 className='mb-3 border-l-4 border-emerald-300 pl-2 font-bold'>About</h1>
                {
                  !spectatorView ?
                    editAbout ?
                    <form className='relative flex flex-col items-center space-y-2' onSubmit={saveAbout}>
                      {
                        editAbout &&
                        <span 
                        onClick={() => setEditAbout(false)}
                        className={'absolute right-0 opacity-50 z-10 hover:cursor-pointer hover:opacity-100 bg-rose-200 rounded-full'}
                        ><ClearOutlinedIcon />
                        </span>
                      }
                      <textarea
                        spellCheck={false}
                        rows={4}
                        value={about}
                        onChange={(e) => updateAbout(e.target.value)}
                        placeholder={'Say something cool...'}
                        className='relative resize-none flex-1 w-full focus:outline-none border-2 border-slate-200 focus:border-slate-400 focus:opacity-100 rounded-xl p-2 text-sm opacity-80'
                      />
                      
                      {
                        typingAbout &&
                        <button onClick={() => console.log('clicked')} className='w-fit m-auto bg-emerald-400 px-2 text-white rounded-sm hover:bg-emerald-300'>Update</button>
                      }
                    </form> 
                    :
                    <div className={`group relative ${isProfileOwner && 'hover:cursor-pointer'}`} onClick={() => {
                      if (isProfileOwner) setEditAbout(true)}}>
                      {
                        isProfileOwner &&
                        <span 
                        className={'absolute right-0 -top-2 z-2 opacity-50 group-hover:opacity-100 bg-emerald-200 rounded-full'}
                        ><EditOutlinedIcon />
                        </span>
                      }
                      <p className='relative -z-10 border-2 border-transparent rounded-xl p-2 text-sm opacity-80 before:content-["\"_"] after:content-["_\""] before:text-emerald-500 after:text-emerald-500'>
                        {profileUser?.about ? profileUser?.about : "User has not set an about"}
                      </p>
                    </div>
                  :
                    <div className={`group relative`}>
                      <p className='relative -z-10 border-2 border-transparent rounded-xl p-2 text-sm opacity-80 before:content-["\"_"] after:content-["_\""] before:text-emerald-500 after:text-emerald-500'>
                        {profileUser?.about ? profileUser?.about : "User has not set an about"}
                      </p>
                    </div>
                }
              </div>
              {/* links section */}
              <div>
                <button className='group flex space-x-1 items-center mb-3 hover:cursor-pointer border-l-4 border-emerald-300 pl-2' onClick={toggleLinks} >
                  <h1 className='font-bold'>Links</h1>
                  <ChevronDownIcon id="links-shown-icon" className={`${linksShown && `rotate-180`} w-4 duration-200`} />
                </button>
                {
                  !linksEmpty ?
                  <div id="links-container" className=''>
                    <div className='w-full flex-col items-center grid gap-2 grid-cols-2 grid-flow-dense'>
                      {userLinks.map((linkArr, i) => (
                        linkArr[1].length > 0 &&
                        <div id={`${linkArr[0]}-link-logo`} key={i} className="items-center p-2 rounded-full hover:scale-110 duration-100 hover:cursor-pointer hover:shadow-2xl hover:shadow-rose-400">
                          <a href={`${linkArr[0] === 'gmail' ? 'mailto:'+linkArr[1] : linkArr[1]}`} target="_blank" className=''> 
                            <div className='flex space-x-2'>
                              <img 
                                src={linkIcons[linkArr[0]]}
                                alt="social media link logos"
                                className={`w-6`}
                              />
                              <p className='font-bold text-xs flex items-center'>{linkArr[0][0].toUpperCase() + linkArr[0].slice(1,)}</p>
                            </div>
                          </a>
                        </div>
                      ))
                    }
                    {
                      isProfileOwner &&
                      !spectatorView &&
                        <span className='bg-emerald-200 p-2 hover:cursor-pointer w-fit rounded-full hover:scale-110 duration-100' onClick={() => setShownModals({...shownModals, addLink: true})}>
                          <AddOutlinedIcon />
                        </span>
                    }
                    </div>
                  </div>
                  :
                  isProfileOwner ?
                    <div className='flex flex-col items-center'>
                      <p className='opacity-70 text-sm'>User has not attached any links</p>
                      {
                        !spectatorView &&
                          <span className='bg-emerald-200 p-2 hover:cursor-pointer w-fit rounded-full hover:scale-110 duration-100' onClick={() => setShownModals({...shownModals, addLink: true})}>
                            <AddOutlinedIcon />
                          </span>
                      }
                    </div>
                  :
                  <div className='flex flex-col items-center'>
                    <p className='opacity-70 text-sm'>User has not attached any links</p>
                  </div>                
                }
              </div>
              {/* settings section */}
              {
                isProfileOwner &&
                !spectatorView &&
                <div className='pt-10 flex flex-col space-y-2'>
                  <hr className='pb-4'/>
                  <h1 className='mb-3 border-l-4 border-emerald-300 pl-2 font-bold'>Profile Settings</h1>
                  <button className='group flex space-x-2 text-sm items-center font-light' onClick={() => setShownModals({...shownModals, changePword: true})}>
                    <Cog6ToothIcon className='w-6 group-hover:rotate-180 group-hover:text-emerald-400 duration-100' />
                    <p>Change Password</p>
                  </button>
                  <button className='group flex space-x-2 text-sm items-center font-light' onClick={() => setShownModals({...shownModals, changeUsername: true})}>
                    <Cog6ToothIcon className='w-6 group-hover:rotate-180 group-hover:text-emerald-400 duration-100' />
                    <p>Change Username</p>
                  </button>
                </div>
              }
            </div>
          </div>
          <div className='relative min-h-screen basis-3/4 bg-gray-100'>
            {
              alert &&
              <div className='absolute top-0 left-1/2 -translate-x-1/2'>
                <Alert content={{body: alert.body, type: alert.type}} />
              </div>
            }
            <div className='h-2 w-full bg-slate-300'></div>
            <span className='flex items-center space-x-2 text-xs mt-2 ml-4 font-light select-none'>
              <label htmlFor='spectator' className='hover:cursor-pointer hover:opacity-100'>Spectator View</label>
              <input 
                type="checkbox" 
                id='spectator' 
                name='spectator'
                checked={spectatorView}
                onChange={() => setSpectatorView(prev => !prev)}
                className='appearance-none h-3 w-3 focus:opacity-100 focus:outline-none border-2 border-slate-200 checked:border-none checked:bg-emerald-400 rounded-md hover:cursor-pointer hover:opacity-100' 
              />
            </span>
            <h1 className='font-bold text-center text-xl pt-4'>User reviews</h1>

            <div className='flex flex-col justify-center'>
              {
                isProfileOwner ?
                  reviews.length ?
                  reviews?.map((review, i) => (
                    <div key={review.id + i} className='-mb-10 scale-90'>
                      <Review id={i} review={review}/>
                    </div>
                  ))
                  :
                  !spectatorView ?
                    <div className='mt-20 m-auto'>
                      <p className='font-light'>No Reviews | <Link to='/compose' className='text-blue-500 font-normal hover:underline underline-offset-4'>Create one now</Link></p>
                    </div>
                  :
                  <div className='mt-20 m-auto'>
                    <p className='font-light'>No Reviews</p>
                  </div>
                :
                reviews.length ?
                reviews?.map((review, i) => (
                  <div key={review.id + i} className='-mb-10 scale-90'>
                    <Review id={i} review={review}/>
                  </div>
                ))
                :
                <div className='mt-20 m-auto'>
                  <p className='font-light'>No Reviews</p>
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