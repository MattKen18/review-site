import ReactS3Client from 'react-aws-s3-typescript';
import React, { useEffect, useState } from 'react'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';

const S3_BUCKET ='test-image-store-weviews';
const REGION ='us-east-2'; 
const ACCESS_ID ='AKIAR74LVHA4ZCOAF7OT';
const SECRET_ACCESS_KEY ='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';

const config = {
  bucketName: S3_BUCKET,
  dirName: 'userName', 
  region: REGION,
  accessKeyId: ACCESS_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
}

const s3 = new ReactS3Client(config);

const AddImage = () =>  {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([])

  const handleFileInput = (e) => {
    if (e.target.files[0].type.match('image.*')) {
      setSelectedFile(e.target.files[0]);
    } else {
      e.target.value = ''
      alert("invalid file type")
    }
  }

  const uploadImage = async (file) => {
    const fileName = new Date().toString().split(" ").slice(0, 5).join("-") 

    try {
        const res = await s3.uploadFile(file, fileName);
        setUploadedImages(state => [...state, res.location])
        setSelectedFile(null)
    } catch (exception) {
        console.log(exception);
    }
  }
  
  const deleteImage = async (imageIndex) => {
    for (let i=0; i<uploadedImages.length; i++) {
      if (i === imageIndex) {
        const newState = [...uploadedImages]
        const imageToDelArr = newState[i].split('/')
        const imageToDel = imageToDelArr[imageToDelArr.length-1]
        console.log(imageToDel)
        newState.splice(i, 1)
        setUploadedImages(newState)

        try {
            await s3.deleteFile('userName/'+imageToDel); //change to users actual username
            console.log('File deleted');
        } catch (exception) {
            console.log(exception);
        }      
      }
    }
  }

  return (
    <div className='flex flex-col mt-10'>
    {/* image container */}
    <div className='flex h-[300px] space-x-2 justify-center mb-10'>
      {
        uploadedImages.map((image, key) => (
          <div key={key} className='group relative flex items-center w-[250px] h-full bg-slate-100 rounded-md overflow-hidden'>
            <div className='absolute flex items-center justify-center top-0 -z-1 group-hover:z-10 backdrop-blur-sm hover:cursor-pointer w-full h-full'>
              <span className='text-red-600 transform hover:scale-110 duration-300 bg-slate-100 rounded-full'><RemoveCircleOutlinedIcon onClick={() => deleteImage(key)} className='' sx={{ fontSize: 60 }} /></span>
            </div>
            <img src={image} alt="" className='relative object-cover' />
          </div>        
        ))
      }
      { 
        uploadedImages.length < 3 &&
        <div className='flex h-full w-[250px] border-2 border-slate-100 bg-slate-100 opacity-100 items-center justify-center rounded-md'>
          <label htmlFor="review-image-input" className='w-fit hover:cursor-pointer transform hover:scale-110 duration-300 active:text-red'><AddCircleOutlinedIcon className={`${!selectedFile ? `text-primary` : `text-moss opacity-70`}`} sx={{ fontSize: 60 }} /></label>
        </div>
      }


    </div>
    <input type="file" accept="image/*" id='review-image-input' className='hidden' onChange={handleFileInput} />
    
    <div className='flex flex-col items-center justify-center'>
      {
        selectedFile &&
        <p className='mb-4 text-sm'>Image staged, hit 'save' to upload image</p>
      }
      <button onClick={() => uploadImage(selectedFile)} className='w-20 border-2 border-primary bg-primary rounded-md text-white p-2 focus:outline-primary disabled:opacity-70' disabled={selectedFile ? false : true} >Save</button>
    </div>
    </div>
  )
}

export default AddImage