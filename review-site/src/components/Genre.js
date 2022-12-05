import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addFilter, removeFilter, selectFilters, selectFiltering, setFiltering } from '../slices/filterSlice'
import { useSelector } from 'react-redux'


const Genre = (props) => {
  const active = useRef(false) //if genre is an active filter
  const isFiltering = useSelector(selectFiltering) //if app is currently filtering
  const dispatch = useDispatch()
  const currentFilters = useSelector(selectFilters)


  // changes the opacity of genres in the side panel depending on whether
  // or not it's one of the genres being filtered for
  const setOpacity = () => {
    const genre = document.getElementById(props.genre.title)

    if (isFiltering && !active.current) { //if app is filtering but component is not one of the filtering genres
      genre.style.opacity = '0.3'
    } else if (isFiltering && active.current) {
      genre.style.opacity = '1'
    } else if (!isFiltering && active.current){ // if cleared filter with genres still active
      active.current = false 
    } else { // i.e. if !isFiltering
      genre.style.opacity = '1'
    }
  }

  useEffect(() => {
    setOpacity()
  }, [currentFilters]) //runs once on mount and then when current filter changes i.e. when filter is added or removed


  const handleFilter = () => {
    if (!active.current) {
      dispatch(addFilter({title: "genre-" + props.genre.title}))
    } else {
      dispatch(removeFilter({title: "genre-" + props.genre.title}))
    }
    active.current = !active.current
    dispatch(setFiltering())

  }

  return (
    <a 
    href="#"
    id={props.genre.title} //have check for unique genre title
    className={`p-2 mb-2 ${props.genre.color} text-sm text-white border-2 ${props.genre.border} rounded-full duration-300 hover:opacity-100`}
    onMouseOver={(e) => e.target.style.opacity = '1'}
    onMouseOut={
      (e) => {
        if (isFiltering) {
          !active.current ? e.target.style.opacity = '0.3' : e.target.style.opacity = '1'
        }
      }
    }
    onClick={handleFilter}
    >
      {props.genre.title}
    </a>
  )
}

export default Genre