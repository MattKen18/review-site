import React, { useContext, useEffect, useState } from 'react'
import { FileUploader } from "react-drag-drop-files";
import { maxAddOns } from '../parameters';
import FileUpload from './FileUpload';
// import { s3Config } from '../parameters';

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

const ImageAddOnView = ({forumId, updater, stagedImages}) => {
  const [addOns, setAddOns] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  
  // console.log("forumId: ", forumId)
  const config = {
    bucketName: 'test-image-store-weviews',
    dirName: 'forums/'+forumId, 
    region: 'us-east-2',
    accessKeyId: 'AKIAR74LVHA4ZCOAF7OT',
    secretAccessKey: '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',
  }

  
  const handleFileSelect = (file) => {
    setSelectedImage(file)
  }


  useEffect(() => {
    // console.log("selected image: ", selectedImage)
  }, [selectedImage])
  

  return (
    <div className='w-full h-full flex flex-row bg-inherit'>
      <FileUpload 
        updater={updater}
        s3Config={config}
        allowedTypes={fileTypes}
        type={'images'}
        existingFileUrls={[]}
        stagedFilesArr={stagedImages}
        maxAllowed={maxAddOns['images']}
      />
    </div>
  )
}

export default ImageAddOnView