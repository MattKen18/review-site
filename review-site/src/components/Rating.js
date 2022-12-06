import { StarIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFilter, selectFilters, setFiltering, selectMossFiltering, removeFilter } from '../slices/filterSlice';

const Rating = (props) => {

  const dispatch = useDispatch()
  const mossFiltering = useSelector(selectMossFiltering)
  const currentFilters = useSelector(selectFilters)

  // THERE WILL ALWAYS ONLY BE ONE MOSS RATING AT A TIME i.e. only one class with active-moss

  const isActive = () => { //is the active moss filter
    const mossRating = document.getElementById(`moss-${props.mossRating}`)
    return mossRating.classList.contains('active-moss')
  }

  const handleActive = () => {
    const mossRating = document.getElementById(`moss-${props.mossRating}`)

    // if (!mossFiltering && isActive()) { //clears active moss status if the filter is cleared
    //   const activeMoss = document.getElementsByClassName('active-moss')[0] //previous active moss
    //   activeMoss.classList.remove('active-moss')
    // }

    // if (!mossFiltering && !isActive()) {
    //   mossRating.classList.add('active-moss')
    // } else if (!mossFiltering && isActive()) {
    //   const activeMoss = document.getElementsByClassName('active-moss')[0] //previous active moss
    //   activeMoss.classList.remove('active-moss')
    // } else if (mossFiltering && isActive()) {
    //   mossRating.classList.remove('active-moss')
    // }



    if (isActive()) {
      //remove active if the user clicks on the active element
      mossRating.classList.remove('active-moss')
    } else {
      //set active and remove previous active if there was one
      const activeMoss = document.getElementsByClassName('active-moss')[0] //previous active moss
      mossRating.classList.add('active-moss')
      if (activeMoss) {
        activeMoss.classList.remove('active-moss')
      }
    }
    
  }

  const handleFilter = () => {

    // if (!mossFiltering && !isActive(e)) {
    //   //add moss to the applied filters
    //   dispatch(addFilter({title: `moss-${props.mossRating}`}))
    // } else if (mossFiltering && isActive(e)) {
    //   //remove moss from the applied filters
    //   dispatch(removeFilter({title: `moss-${props.mossRating}`}))
    // } else if (mossFiltering && !isActive(e)) {
    //   //replace previous moss filter with the new one
    //   dispatch(addFilter({title: `moss-${props.mossRating}`}))
    // }

    if (mossFiltering && isActive()) {
      // remove moss from the applied filters
      dispatch(removeFilter({title: `moss-${props.mossRating}`}))
    } else {
      // add moss to the applied filters
      dispatch(addFilter({title: `moss-${props.mossRating}`}))
    }
    dispatch(setFiltering())
    handleActive()
  }

  useEffect(() => {
    const mossRating = document.getElementById(`moss-${props.mossRating}`)

    if (!mossFiltering) { // if filter is cleared with there still being an active moss rating filter
      const activeMoss = document.getElementsByClassName('active-moss')[0]
      if(activeMoss){
        activeMoss.classList.remove('active-moss')
      }
      mossRating.style.backgroundColor = '#f8fafc'; //no highlight

    }
    else if (mossFiltering && isActive()) {
      mossRating.style.backgroundColor = '#e2e8f0'; //highlight
    } else {
      mossRating.style.backgroundColor = '#f8fafc'; //no highlight
    }
  }, [currentFilters])

  return (
    <button
      onClick={handleFilter}
      id={`moss-${props.mossRating}`} 
      htmlFor={`${props.mossRating}`}
      onMouseOver={() => document.getElementById(`moss-${props.mossRating}`).style.backgroundColor = '#e2e8f0'}
      onMouseOut={() => {
        if (!isActive()) {
          document.getElementById(`moss-${props.mossRating}`).style.backgroundColor = '#f8fafc'
        }
      }}
      className={'w-full flex items-center hover:bg-slate-200 rounded-lg hover:cursor-pointer p-1'}>
      <span className='mr-2 w-2 font-thin'>{props.mossRating}.</span>
      {
        Array.from({ length: props.mossRating }).map((_, i) => (<StarIcon key={i} className='w-4 text-moss'/>))
      }
    </button>
  )
}

export default Rating