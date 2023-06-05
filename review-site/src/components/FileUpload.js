import React, { useEffect, useState } from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import s3Client from '../s3';

const FileUpload = ({updater, s3Config, allowedTypes, type, existingFileUrls, stagedFilesArr, maxAllowed}) => {
  // const [selectedFiles, setSelectedFiles] = useState([])
  const [filesToShow, setFilesToShow] = useState([]) //[[file, fileUrl], ]
  const [draggingOver, setDraggingOver] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [positions, setPositions] = useState({})

  const s3 = s3Client(s3Config)

  useEffect(() => {
    setFilesToShow(stagedFilesArr) // updates the file uploader's files to show with files that user has staged i.e. useful if they navigated to another component before uploading
  }, [stagedFilesArr])

  const handleDragOver = (e) => {
    setDraggingOver(true)
    e.preventDefault()
  }

  const handleDragLeave = (e) => {
    setDraggingOver(false)
    e.preventDefault()
  }


  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    // setSelectedFiles([...selectedFiles, file])
    handleFileDisplay(file)
    setDraggingOver(false)
  } 

  useEffect(() => {
  
    for (const fileUrl of existingFileUrls) {
      setFilesToShow([...filesToShow, ['', fileUrl, true]])
    }
    
  }, [existingFileUrls])
  
  const handleUploadClick = (e) => {
    handleFileDisplay(e.target.files[0])

  }

  const handleFileDisplay = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const fileDataURL = reader.result
      setFilesToShow([...filesToShow, [file, fileDataURL, false]]) //uploaded to s3 = false
      updater([...filesToShow, [file, fileDataURL, false]])
    }
    reader.readAsDataURL(file)
  }

  const deleteFile = (key) => {
    const files = [...filesToShow]
    files.splice(key, 1)
    setFilesToShow(files)
    updater(files)
  }

  const handleFileDragStart = (e, index) => {
    e.dataTransfer.setData("text", index)
    const movingFile = document.getElementById('image-'+index)

    // console.log(getComputedStyle(movingFile).width)
    e.dataTransfer.setDragImage(movingFile, Number(getComputedStyle(movingFile).width.split('px')[0])/2, Number(getComputedStyle(movingFile).height.split('px')[0])/2);
    e.dataTransfer.effectAllowed = 'move'; // Specify the effect allowed for the drag operation
    movingFile.style.cursor = 'none'; // Change the cursor appearance
    setIsDragging(true)
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    const dragIndex = e.dataTransfer.getData('text')
    const dropIndex = e.target.id.split('-')[1]
    
    const shownFilesArr = [...filesToShow]
    // const selectedFilesArr
    const [draggedFileArr, existingFileArr] = [shownFilesArr[dragIndex], shownFilesArr[dropIndex]]

    shownFilesArr[dropIndex] = draggedFileArr 
    shownFilesArr[dragIndex] = existingFileArr


    setFilesToShow(shownFilesArr)
    updater(shownFilesArr)
    setIsDragging(false)
  }

  const handleFileDragEnd = (e) => {
    e.target.style.cursor = 'grab'
  }

  const handleFileDragOver = (e) => {
    e.preventDefault()
  }

  const clearAllFiles = () => {
    setFilesToShow([])
    updater([])
  }


  const uploadFilesToS3 = async (files) => {
    console.log('files: ', files)
    for (let i=0; i<files.length; i++) {
      
      try {
        if (!files[i][2]) { //upload only the files not already uploaded
          const fileName = new Date().toString().split(" ").slice(0, 5).join("-") + '-'+i
          const res = await s3.uploadFile(files[i][0], fileName);
          files[i][1] = res.location
          files[i][2] = true //successfully uploaded to s3
          console.log(res.location)
          setFilesToShow(files)
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  }

  // const 



  return (
    <div className='relative bg-slate-900 w-full h-full'>
      {
        filesToShow.length > 0 &&
        <div className='absolute -top-52 w-full h-52 py-2 w-ful flex flex-row space-x-4 bg-inherit'>
          {
            <>
            {
              <div className='flex flex-row space-x-4'>
                {
                  filesToShow.map((fileArr, key) => (
                    <div 
                      key={key} 
                      className={`group relative rounded-md w-40 z-50 overflow-hidden bg-gray-600 active:cursor-none hover:cursor-grab ${isDragging && ``}`} 
                      onDragStart={(e) => handleFileDragStart(e, key)}
                      onDragOver={handleFileDragOver}
                      onDrop={handleFileDrop}
                      onDragEnd={handleFileDragEnd}
                      draggable
                      >
                      <button 
                        type='button' 
                        onClick={() => deleteFile(key)}
                        className='hidden absolute z-20 group-hover:block top-2 right-2 bg-error rounded-lg px-2 py-2 text-2xs'>Remove
                      </button>
                      <img 
                        src={fileArr[1]}
                        id={'image-'+key}
                        alt="uploaded image" 
                        className='relative group-hover:opacity-50 duration-100 z-10 w-full h-full object-cover rounded-lg' 
                      /> 
                    </div>
                  ))

                }

              </div>

            }
            <div className='pt-4 self-end'>
              {/* <button type='button' className='flex items-center space-x-2 hover:text-success' onClick={() => uploadFilesToS3(filesToShow)}>
                <CloudUploadOutlinedIcon />
                <p className='inline-block'>Save</p>
              </button>
              <button type='button' className='flex items-center space-x-2 hover:text-success' onClick={() => updater(filesToShow)}>
                <CloudUploadOutlinedIcon />
                <p className='inline-block'>Updater</p>
              </button> */}
              <button type='text' className='flex items-center justify-center space-x-1 bg-error opacity-80 hover:opacity-100 rounded-lg px-4 py-2 font-bold text-sm' onClick={clearAllFiles}>
                <RemoveCircleOutlineOutlinedIcon />
                <p className='inline-block'>Clear</p>
              </button>
            </div>
            </>
          }
        </div>
      }
      {
        filesToShow.length < maxAllowed ?
        <>
          <label 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            htmlFor="image-upload"
            className={`w-full h-full flex flex-col items-center justify-center bg-slate-700 animate-pulse space-y-2 hover:cursor-pointer border-2 ${draggingOver ? `border-success` :  `border-cyan-600`}`}
          >
            <p className={`text-xs font-bold ${filesToShow.length < maxAllowed ? `text-success` : `text-error`}`}>{`${filesToShow.length}/${maxAllowed}`} images added</p>
            <h1 className='font-extrabold text-2xl'>
              Drop image here
            </h1>
            <p className=''>or</p>
            <span className='text-center bg-cyan-600 rounded-lg w-36 font-bold py-2 '>Choose File</span>
          </label>
          <input 
            type="file"
            id='image-upload'
            className='hidden'
            onChange={handleUploadClick}
          />
        </>
        :
        <label 
            onDragOver={e => e.preventDefault()}
            onDrop={e => e.preventDefault()}
            onDragLeave={e => e.preventDefault()}
            className={`w-full h-full flex flex-col items-center justify-center bg-slate-700 space-y-2 border-2 border-primary`}
          >
            <h1 className='font-bold text-lg'>
              Max images added
            </h1>
        </label>      
        }
    </div>
  )
}

export default FileUpload