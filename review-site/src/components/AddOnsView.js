import React, { useEffect, useState, useRef } from 'react'
import { maxAddOns, chatAddOns } from '../parameters'

import { useSprings, useSpring, animated, config } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import clamp from 'lodash';
import swap from 'lodash';
import DraggableImg from './DraggableImg';
import DraggableList from './DraggableList';
import ImageAddOnView from './ImageAddOnView';

import s3Client from '../s3';


const AddOnsView = ({updater, stagedImages, forumId}) => {
  const [addOnType, setAddOnType] = useState(Object.keys(chatAddOns)[0])
  const [addOns, setAddOns] = useState(chatAddOns)

  // const [addOnView, setAddOnView] = useState(Object.keys(addOns)[0])

  const config = {
    bucketName: 'test-image-store-weviews',
    dirName: 'forums/'+forumId, 
    region: 'us-east-2',
    accessKeyId: 'AKIAR74LVHA4ZCOAF7OT',
    secretAccessKey: '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',
  }

  const s3 = s3Client(config)

  const handleAddOnTypeChange = (type) => {
    setAddOnType(type)
  }

  // const updateAddOn = (addOn=[], type=addOnType) => {
  //   const addOnsCopy = {...addOns}
  //   addOnsCopy[type] = addOn
  //   setAddOns(addOnsCopy)
  //   console.log('add on type: ', addOnsCopy)
  // }

  const uploadImagesToS3 = async (files) => {
    console.log('files: ', files)
    for (let i=0; i<files.length; i++) {
      
      try {
        if (!files[i][2]) { //upload only the files not already uploaded
          const fileName = new Date().toString().split(" ").slice(0, 5).join("-") + '-'+i
          const res = await s3.uploadFile(files[i][0], fileName);
          files[i][1] = res.location
          files[i][2] = true //successfully uploaded to s3
          // console.log(res.location)
          const addOnsCopy = {...addOns}
          addOnsCopy['images'][i] = files[i]
          setAddOns(addOnsCopy)
          console.log(addOnsCopy)
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  }

  return (
    <div className='w-full h-full flex space-x-2 bg-slate-900 pl-2 py-1'>
      {/* <button onClick={() => uploadImagesToS3(addOns['images'])}>Upload</button> */}
      {/* options selector */}
      <div className='flex basis-2/12 flex-col'>
        {
          Object.keys(chatAddOns).map((addOn, key) => (
            <button type='button' key={key}
            className={`text-left py-2 px-2 ${addOnType === addOn && 'text-cyan-600'} hover:bg-[#193044] font-bold duration-150 rounded-md`}
            onClick={() => handleAddOnTypeChange(addOn)}
            >
              {addOn[0].toUpperCase() + addOn.slice(1)}
            </button>
          ))
        }
      </div>
      {/* addons viewer */}
      {
        addOnType === 'images' ?
        <div className='flex-1 pr-2'>
          <ImageAddOnView forumId={forumId} updater={updater} stagedImages={stagedImages} />
        </div>
        :
        <></>
      }
    </div>
  )
}

export default AddOnsView