import React from 'react'

const ForumRoom = ({forum}) => {

  return (
    <div>
      <p>Forum Room {forum.id}</p>
      <p>{forum.name}</p>
      <p>{forum.topic}</p>

    </div>
  )
}

export default ForumRoom