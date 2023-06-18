import React, { useEffect, useRef, useState } from 'react'

const ImageAddOn = ({updateAddOn, clear}) => {
  const [draggingOver, setDraggingOver] = useState(false)
  const [droppedImage, setDroppedImage] = useState(null)

  const dropAreaRef = useRef(null)

  const imageType = /^image\//

  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggingOver(true)
  };

  const handleDragLeave = () => {
    setDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault()
    setDraggingOver(false)

    const files = e.dataTransfer.files
    console.log(e.dataTransfer)
    if (imageType.test(e.dataTransfer.files[0].type)) { // if dragging over an image
      setDraggingOver(true)
      setDroppedImage(files[0])
      updateAddOn('images', files[0])
    } else {
      console.log('Please upload an image')
      setDraggingOver(false)
    }
    // Do something with the files, e.g. upload to server
  };


  return (
    <div 
      ref={dropAreaRef} 
      className={`${draggingOver && `border-[1px] border-green-500`} relative flex items-center justify-center flex-1`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className='flex flex-col items-center justify-center space-y-2 font-bold text-2xl'>
        <span className='animate-pulse w-full text-center'>Drag and Drop Image or Video</span>
        <p className='text-sm'>or</p>
        <div className='flex flex-col space-y-2'>
          <input 
            type="file"
            className='appearance-none bg-primary outline-none text-sm rounded-lg w-fit' 
          />
          {/* <progress id="progress-bar" max={3} value={1} className=""></progress> */}
        </div>
        
      </div>
    </div>
  )
}

export default ImageAddOn