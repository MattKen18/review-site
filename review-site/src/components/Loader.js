import React, { useEffect, useState } from 'react'
import LoadingAnimation from 'react-loading';

const Loader = ({params: {content = [], type, color, height, width}}) => {
  const [timePassed, setTimePassed] = useState(0) 
  const [shownContentIndex, setShownContentIndex] = useState(0)
  const [shownContent, setShownContent] = useState('')


  useEffect(() => {
    setShownContent(content[0])
  }, [content])


  useEffect(() => {
    const timeCounter = setInterval(() => {
      setTimePassed(prevTime => prevTime+1)
    }, [1000])

    return () => clearInterval(timeCounter)
  }, [])

  const displayContent = () => {
    if (shownContentIndex < content.length-1) {
      if (timePassed%10 === 0 && timePassed > 0) {
        setShownContentIndex(prev => prev+1)
      } 
    }
  }

  useEffect(() => {
    setShownContent(content[shownContentIndex])
  }, [shownContentIndex])

  useEffect(() => {
    displayContent()
  }, [timePassed])

  return (
    <>
      {
        shownContent &&
        <p className='text-center flex-1 font-bold text-sm'>{shownContent}</p>
      }
      <LoadingAnimation className="" type={type} color={color} height={height} width={width} />
    </>
  )
}

export default Loader