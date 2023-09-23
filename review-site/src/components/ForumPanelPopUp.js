import { React, useState, useEffect } from 'react'
import { getUserFromFirestore } from '../firebase'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import ProfileThumbnail from './ProfileThumbnail';

const ForumPanelPopUp = ({forum, memberIds}) => {
  const [members, setMembers] = useState([])

  const [membersConvertedToFirestoreUsers, setMembersConvertedToFirestoreUsers] = useState(false)

  useEffect(() => {
    
    const getConvertedMembers = async () => {
      const firestoreMembers = []
      for (let memberId of memberIds) {
        const user = await getUserFromFirestore(memberId)
      
        firestoreMembers.push(user)
      }
      setMembers(firestoreMembers)
    }
    
    // gets users from firestore from members list
    getConvertedMembers()

  }, [memberIds])
  
  useEffect(() => {
    console.log(memberIds)
  }, [memberIds])

  return (
    <div className='w-full h-3/4 min-h-[200px] bg-white rounded-md overflow-hidden flex flex-col'>
      <div className='flex-1'>
        <h1 className='font-bold px-2 text-white bg-primary'>Members</h1>
        <div className='flex flex-row space-x-4 justify-center items-center bg-slate-200 text-sm'>
          <span className='flex flex-row space-x-1 items-center justify-center'>
            <GroupsOutlinedIcon />
            <p>{members.length}</p>
          </span>

          <span className='flex flex-row space-x-1 items-center justify-center'>
            <QueryBuilderOutlinedIcon />
            <p>{forum.lifespan}</p>
          </span>
        </div>
        <ul className=''>
          {members.map((member, key) => (
            <li key={key} className='group text-xs font-light hover:bg-slate-200 flex flex-row'>
              <a href='' className='flex-1 pl-2 py-2 flex flex-row space-x-1 items-center'>
                <ProfileThumbnail thumbnailSrc={member.photoURL} size={'sm'} />
                <p>{member.userName}</p>
              </a>
              <div className='group-hover:flex hidden flex-row w-14'>
                <button className='w-1/2 hover:bg-success hover:text-white'><PersonAddOutlinedIcon sx={{ fontSize: 14 }} /></button>
                <button className='w-1/2 hover:bg-error hover:text-white'><PriorityHighOutlinedIcon sx={{ fontSize: 14 }} /></button>
              </div>
            </li>
          ))}
        </ul>

      </div>
      <div className='flex flex-row w-full items-center justify-center mb-1'>
        <button className='bg-fail px-2 text-white font-bold rounded-md'>Leave</button>
      </div>
    </div>
  )
}

export default ForumPanelPopUp