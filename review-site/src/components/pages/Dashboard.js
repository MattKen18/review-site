import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAuthorReviews, getUserFollowers, getUserFollowing, getUserFromFirestore, getUserSavedReviews } from '../../firebase'
import AdSpace from '../AdSpace'
import Review from '../Review'
import SidePane from '../SidePane'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import UserCard from '../UserCard'

const Dashboard = () => {
  const { id } = useParams()
  const auth = getAuth()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [author, setAuthor] = useState(null) //corresponding user from firestore (of current user) with additional fields and foreign keys to review
  const [reviews, setReviews] = useState([])
  const [savedReviews, setSavedReviews] = useState([])
  const [numOfHelpfuls, setNumOfHelpfuls] = useState(null) // total number of people who vote that the author's reviews are helpful
  const [numOfUnHelpfuls, setNumOfUnHelpfuls] = useState(null) // total number of people who vote that the author's reviews are unhelpful
  const [statShown, setStatShown] = useState('reviews')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [savesCount, setSavesCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //prevent someone else from accessing this page if they are not the current user
        if (user.uid === id && !user.isAnonymous) {
          setCurrentUser(user)
        } else {
          navigate('/')
        }
      } else {
        navigate('/login-signup')
      }
    })
  }, [])

  //fetch user and all their reviews from firestore  
  useEffect(() => {
    getUserFromFirestore(id).then((user) => {
      setAuthor(user)
      getAuthorReviews(user.uid).then((reviews) => {
        setReviews(reviews)
      })
      getUserSavedReviews(user).then(saves => {
        setSavedReviews(saves)
        setSavesCount(saves.length)
      })
    })
  }, [currentUser, statShown])


  useEffect(() => {
    if (reviews.length) {
      let helpfuls = 0
      let unhelpfuls = 0
      for (let review of reviews) {
        helpfuls+=review.helpfuls
        unhelpfuls+=review.unhelpfuls
      }
      setNumOfHelpfuls(helpfuls)
      setNumOfUnHelpfuls(unhelpfuls)
    }
  }, [reviews])


  useEffect(() => {
    let helpfuls = 0
    let unhelpfuls = 0
    for (let review of reviews) {
      helpfuls += review.helpfuls ? review.helpfuls : 0
      unhelpfuls += review.unhelpfuls ? review.unhelpfuls : 0
      // console.log(helpfuls, unhelpfuls)
    }

    setNumOfHelpfuls(helpfuls)
    setNumOfUnHelpfuls(unhelpfuls)
  }, [reviews])

  useEffect(() => {
    // console.log(numOfHelpfuls, numOfUnHelpfuls)
  }, [numOfHelpfuls, numOfUnHelpfuls])

  useEffect(() => {
    if (author) {
        getUserFollowers(author?.uid, author?.followers).then(followers => {
          setFollowers(followers)
          setFollowerCount(followers.length)
        })
        getUserFollowing(author?.uid, author?.following).then(following => {
          setFollowing(following)
          setFollowingCount(following.length)
        })
      }
  }, [author])

  useEffect(() => {
    getUserFromFirestore(id).then((user) => {
      setAuthor(user)
    })
  }, [statShown])

  const increaseFollowingCount = () => {
    setFollowingCount(count => count+1)
  }

  const decreaseFollowingCount = () => {
    setFollowingCount(count => count-1)
  }

  const increaseSavesCount = () => {
    setSavesCount(count => count+1)
  }

  const decreaseSavesCount = () => {
    setSavesCount(count => count-1)
  }

  return (
    <div className='flex'>
      <aside className='min-h-screen basis-1/5'>
        <AdSpace />
      </aside>

      <div className='flex-1 px-20 bg-gray-100'>
        <div className='mt-10'>
          <h1 className='text-2xl font-bold'>Hello <span className='text-primary'>{author?.userName}</span></h1>
          <p className='font-light text-sm opacity-60'>Welcome to your Dashboard!</p>
        </div>
        <div className='flex items-end space-x-8 select-none'>
          <div onClick={() => setStatShown('reviews')} className={`relative group items-center justify-center flex flex-row h-fit space-x-2 bg-white hover:scale-[1.05] hover:cursor-pointer border-b-4 hover:border-blue-400 duration-200 basis-1/4 rounded-md shadow-sm p-2 ${statShown === 'reviews' ? `border-blue-500` : `border-white`}`}>
            <p className='text-center opacity-70 font-bold'>Reviews</p>
            <p className='font-bold text-lg text-blue-400'>{reviews.length}</p>
            {/* <span className='w-fit'><PencilSquareIcon className={`w-6 group-hover:text-blue-500 ${statShown === 'reviews' ? `opacity-100 text-blue-500` : `opacity-70`}`}/></span> */}
          </div>
          <div onClick={() => setStatShown('saves')} className={`relative group items-center justify-center flex flex-row h-fit space-x-2 bg-white hover:scale-[1.05] hover:cursor-pointer border-b-4 hover:border-primary duration-200 basis-1/4 rounded-md shadow-sm p-2 ${statShown === 'saves' ? `border-primary` : `border-white`}`}>
            <p className='text-center font-bold opacity-70'>Saves</p>
            <p className='font-bold text-lg text-primary'>{savesCount}</p>
            {/* <span className='w-fit'><BookmarksOutlinedIcon className={`w-6 group-hover:text-primary ${statShown === 'saves' ? `opacity-100 text-primary` : `opacity-70`}`}/></span> */}
          </div>
          <div onClick={() => setStatShown('followers')} className={`relative group items-center justify-center flex flex-row h-fit space-x-2 bg-white hover:scale-[1.05] hover:cursor-pointer border-b-4 hover:border-amber-500 duration-200 basis-1/4 rounded-md shadow-sm p-2 ${statShown === 'followers' ? `border-amber-500` : `border-white`}`}>
            <p className='text-center font-bold opacity-70'>Followers</p>
            <p className='font-bold text-lg text-amber-500'>{followerCount}</p>
            {/* <span className='w-fit'><GroupsOutlinedIcon className={`w-6 group-hover:text-amber-500 ${statShown === 'followers' ? `opacity-100 text-amber-500` : `opacity-70`}`}/></span> */}
          </div>
          <div onClick={() => setStatShown('following')} className={`relative group items-center justify-center flex flex-row h-fit space-x-2 bg-white hover:scale-[1.05] hover:cursor-pointer border-b-4 hover:border-slate-500 duration-200 basis-1/4 rounded-md shadow-sm p-2 ${statShown === 'following' ? `border-slate-500` : `border-white`}`}>
            <p className='text-center font-bold opacity-70'>Following</p>
            <p className='font-bold text-lg text-slate-500'>{followingCount}</p>
            {/* <span className='w-fit'><PeopleOutlinedIcon className={`w-6 group-hover:text-slate-500 ${statShown === 'following' ? `opacity-100 text-slate-500` : `opacity-70`}`}/></span> */}
          </div>
          <div className='relative bg-white h-24 duration-200 basis-1/4 rounded-lg shadow-sm p-2'>
            <p className='text-center opacity-70 font-bold'>Helpfuls</p>
            <div className='absolute flex mt-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <p className='font-bold text-lg text-green-400 text-center'>{numOfHelpfuls}</p>
              <div className='ml-4'>
                <div className='text-green-400 w-8 h-8'>
                  <CircularProgressbar className='' value={(numOfHelpfuls/(numOfHelpfuls+numOfUnHelpfuls > 0 ? numOfHelpfuls+numOfUnHelpfuls : 1))*100} text={`${(numOfHelpfuls/(numOfHelpfuls+numOfUnHelpfuls > 0 ? numOfHelpfuls+numOfUnHelpfuls : 1))*100}%`} styles={buildStyles({
                                                                                            pathColor: `#34d399`,
                                                                                            textColor: '#34d399',
                                                                                            trailColor: '#d6d6d6',
                                                                                            backgroundColor: '#3e98c7',})} />
                </div>
              </div>
            </div>
          </div>
          <div className='relative bg-white h-24 duration-200 basis-1/4 rounded-lg shadow-sm p-2'>
            <p className='text-center opacity-70 font-bold'>Unhelpfuls</p>
            <div className='absolute flex mt-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <p className='font-bold text-lg text-rose-600 text-center'>{numOfUnHelpfuls}</p>
              <div className='ml-4'>
                <div className='text-rose-600 w-8 h-8'>
                  <CircularProgressbar className='' counterClockwise={true} value={(numOfUnHelpfuls/(numOfHelpfuls+numOfUnHelpfuls > 0 ? numOfHelpfuls+numOfUnHelpfuls : 1))*100} text={`${(numOfUnHelpfuls/(numOfHelpfuls+numOfUnHelpfuls > 0 ? numOfHelpfuls+numOfUnHelpfuls : 1))*100}%`} styles={buildStyles({
                                                                                            pathColor: `#e11d48`,
                                                                                            textColor: '#e11d48',
                                                                                            trailColor: '#d6d6d6',
                                                                                            backgroundColor: '#3e98c7',})} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className='mt-10'>
            {
              statShown === 'reviews' ?
                  <>
                    <h1 className='font-bold text-blue-500 border-l-4 border-slate-300 rounded-sm px-2 py-1'>Reviews</h1>
                    <div className='mt-10'>
                      {
                        reviews.length ? 
                          reviews?.map((review, i) => (
                            <Review key={review.id + i} review={review} incSaves={increaseSavesCount} decSaves={decreaseSavesCount} />
                          ))
                        :
                        <p className='font-light'>No Reviews | <Link to='/compose' className='text-blue-500 font-normal hover:underline underline-offset-4'>Create one now</Link></p>
                      }
                    </div>
                  </>
              :
              statShown === 'saves' ?
                  <>
                    <h1 className='font-bold text-primary border-l-4 border-slate-300 rounded-sm px-2 py-1'>Saved Reviews</h1>
                    <div className='mt-10'>
                      {
                        savedReviews.length ? 
                          savedReviews?.map((review, i) => (
                            <Review key={review.id + i} review={review} incSaves={increaseSavesCount} decSaves={decreaseSavesCount} />
                          ))
                        :
                        <p className='font-light'>No Saves yet</p>
                      }
                    </div>
                  </>
            :
            statShown === 'followers' ?
                <>
                <h1 className='font-bold text-amber-500 border-l-4 border-slate-300 rounded-sm px-2 py-1'>Followers</h1>
                <div className='grid grid-cols-3 gap-4 mt-10'>
                  {
                    followers?.length ? 
                      followers?.map((follower, i) => (
                        <UserCard key={follower.uid} currentUserId={author?.uid} user={follower} incFollowing={increaseFollowingCount} decFollowing={decreaseFollowingCount} />
                      ))
                    :
                    <p className='font-light'>You have no followers</p>
                  }
                </div>
              </>
            :
            statShown === 'following' ?
                <>
                <h1 className='font-bold text-amber-500 border-l-4 border-slate-300 rounded-sm px-2 py-1'>Following</h1>
                <div className='grid grid-cols-3 gap-4 mt-10'>
                  {
                    following?.length ? 
                      following?.map((followed, i) => (
                        <UserCard key={followed.uid} currentUserId={author?.uid} user={followed} incFollowing={increaseFollowingCount} decFollowing={decreaseFollowingCount} />
                      ))
                    :
                    <p className='font-light'>You are not following anyone</p>
                  }
                </div>
              </>
            :
            <></>
            }
        </div>       
      </div>
    </div>
  )
}

export default Dashboard