import React, { useEffect, useRef, useState } from 'react'

const AddOnChatEntryView = ({addOns, type}) => {
  const [addOnsObj, setAddOnsObj] = useState()

  useEffect(() => {
    console.log("Add Ons: ", addOns)
    try {
      // setAddOnsObj(JSON.parse(addOns))
      setAddOnsObj(JSON.parse(JSON.parse(addOns)));
      console.log(JSON.parse(JSON.parse(addOns)))
    } catch (e) {
      console.log(addOns)
      setAddOnsObj(JSON.parse(addOns))
    }
  }, [addOns])

  useEffect(() => {
    console.log(addOnsObj)
  }, [addOnsObj])

  // const imagesAdded = useRef(false)

  // useEffect(() => {
  //   if (type == 'images' && addOns.images.length) {
  //     const imageHolders = document.querySelectorAll('.addOn-image')
  //     if (!imagesAdded.current) {
  //       for (let i=0; i<addOns.images.length; i++) {
  //         imageHolders[i].style.backgroundImage = `url(${addOns.images[i]})`
  //         imageHolders[i].style.backgroundPosition = "center"
  //         imageHolders[i].style.backgroundRepeat = "no-repeat"
  //         imageHolders[i].style.backgroundSize = "contain"

  //         console.log(imageHolders[i].style.backgroundImage)
  //       }
  //       imagesAdded.current = true;
  //     }
  //   }
  
  // }, [addOns, type])
  

  return (
    <div className='w-full h-[300px] mt-2 mb-2'>
      {
        type == 'images' ?
        // Media container
        <div className='h-full w-full flex flex-row flex-start space-x-3'>
          {
           addOnsObj?.images?.map((imgFile, key) => (
            <div key={key} className='overflow-hidden w-1/3 h-full bg-tertiary rounded-lg'>
              <img src={imgFile.url} alt={`add on image` + key+1} className='object-contain w-full h-full' />
            </div>
           )) 
          }

        </div>
        :
        // Links/text container
        <div></div>
      }
    </div>
  )
}

export default AddOnChatEntryView