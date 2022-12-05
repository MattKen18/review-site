import { StarIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFilter, selectFilters, setFiltering } from '../slices/filterSlice';

const Rating = (props) => {
  const active = useRef(false);

  const dispatch = useDispatch();
  const currentFilters = useSelector(selectFilters)

  const handleFilter = () => {
    dispatch(addFilter({title: "moss-" + props.mossRating}))
    dispatch(setFiltering())
    
  }

  useEffect(() => {
    if (currentFilters.includes("moss-" + props.mossRating)) {
      active.current = false
    } else{
      active.current = true
    }
  }, [currentFilters])


  return (
    <a 
      onClick={handleFilter} 
      htmlFor={`${props.mossRating}`}
      className={`${active.current ? `bg-slate-200` : `bg-transparent`} w-full flex items-center hover:bg-slate-200 rounded-lg hover:cursor-pointer p-1`}>
      <span className='mr-2 w-2 font-thin'>{props.mossRating}.</span>
      {
        Array.from({ length: props.mossRating }).map((_, i) => (<StarIcon key={i} className='w-4 text-moss'/>))
      }
    </a>
  )
}

export default Rating