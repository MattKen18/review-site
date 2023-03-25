import { UserCircleIcon } from '@heroicons/react/24/solid';
import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { handleUserFollow, handleUserUnfollow } from '../firebase';

const UserCard = ({currentUserId, user, incFollowing, decFollowing}) => {
  const [dateFollowed, setDateFollowed] = useState(null)
  const [isUserFollowingCurrentUser, setIsUserFollowingCurrentUser] = useState(false) //then user is a follower of current user
  const [isCurrentUserFollowingUser, setIsCurrentUserFollowingUser] = useState(false) //then current user is following user
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)


  useEffect(() => {
    const dateFollowed = new Date(user.following[currentUserId].dateFollowed)
    setDateFollowed(`${dateFollowed.getMonth() + 1}/${dateFollowed.getDate()}/${dateFollowed.getFullYear()}`)

  }, [])

  useEffect(() => {

    if (Object.keys(user.following).indexOf(currentUserId) !== -1) {
      setIsUserFollowingCurrentUser(true)
    } else {
      setIsUserFollowingCurrentUser(false)
    }

    if (Object.keys(user.followers).indexOf(currentUserId) !== -1) {
      setIsCurrentUserFollowingUser(true)
    } else {
      setIsCurrentUserFollowingUser(false)
    }

  }, [])

  useEffect(() => {
    setFollowerCount(Object.keys(user.followers).length)
    setFollowingCount(Object.keys(user.following).length)
  }, [])

  const handleFollow = () => {
    handleUserFollow(currentUserId, user.uid).then(result => {
        if (result) {
        setIsCurrentUserFollowingUser(true)
        incFollowing()
        setFollowerCount(count => count+1)
      }
    })
  }

  const handleUnFollow = () => {
    handleUserUnfollow(currentUserId, user.uid).then(result => {
      if (result) {
        setIsCurrentUserFollowingUser(false)
        decFollowing()
        setFollowerCount(count => count-1)
      }
    })
  }

  useEffect(() => {
    // console.log(user.following)
  }, [])

  return(
      <div className='p-2 flex items-center flex-row space-x-4 bg-white rounded-lg'>
        <Link to={`/user/${user.uid}/profile`} target='_blank' className='flex flex-row items-center flex-1 space-x-4'>
          <div className='w-10 h-10 rounded-full overflow-hidden'>
            {
              user.photoURL ?
              <img 
                src={`${user?.photoURL}`}
                alt="profile pic"
                className='w-full h-full object-cover'
                />
              :
              <UserCircleIcon className='w-full' />
            }
          </div>
          <div className='flex-1'>
            <p className='font-bold'>{user.userName}</p>
            <div className='flex flex-row text-xs space-x-2'>
              <p>Followers <span>{followerCount}</span></p>
              <p>Following <span>{followingCount}</span></p>
            </div>
            <p className='text-xs font-light -mt-1 opacity-80'>Follower since {dateFollowed}</p>
          </div>
        </Link>
        <div className=''>
          {
            isCurrentUserFollowingUser ?
            <button className='p-2 bg-fail text-white text-xs rounded-md hover:scale-105 duration-100' onClick={() => handleUnFollow()}>unfollow</button>
            :
            <button className='p-2 bg-success text-white text-xs rounded-md hover:scale-105 duration-100' onClick={() => handleFollow()}>follow</button>
          }
        </div>
      </div>
  )
}

export default UserCard;