import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addFilter, removeFilter, selectFilters, selectFiltering, setFiltering, selectGenreFiltering } from '../slices/filterSlice'
import { useSelector } from 'react-redux'
import { generateUtilityClass } from '@mui/material'


const Genre = ({genre: { title, color }}) => {
  const active = useRef(false) //if genre is an active filter
  const genreFiltering = useSelector(selectGenreFiltering)
  const currentFilters = useSelector(selectFilters)

  const dispatch = useDispatch()


  // changes the opacity of genres in the side panel depending on whether
  // or not it's one of the genres being filtered for
  const setOpacity = () => {
    const genre = document.getElementById(title)

    if (genreFiltering && !active.current) { //if app is filtering but component is not one of the filtering genres
      genre.style.opacity = '0.3'
    } else if (genreFiltering && active.current) {
      genre.style.opacity = '1'
    } else if (!genreFiltering && active.current){ // if cleared filter with genres still active
      active.current = false 
    } else { // i.e. if !genreFiltering
      genre.style.opacity = '1'
    }
  }

  useEffect(() => {
    setOpacity()
  }, [currentFilters]) //runs once on mount and then when current filter changes i.e. when filter is added or removed

  useEffect(() => {

    //set the color of the genres
    const genre = document.getElementById(title)
    genre.style.backgroundColor = color
    genre.style.borderColor = color

  }, [])


  const handleFilter = () => {
    if (!active.current) {
      dispatch(addFilter({title: "genre-" + title}))
    } else {
      dispatch(removeFilter({title: "genre-" + title}))
    }
    active.current = !active.current
    // dispatch(setFiltering())

  }

  return (
    <span 
    id={title} //have check for unique genre title
    className={`p-2 mb-2 text-sm text-white border-2 rounded-full duration-300 hover:opacity-100 hover:cursor-pointer`}
    onMouseOver={(e) => e.target.style.opacity = '1'}
    onMouseOut={
      (e) => {
        if (genreFiltering) {
          !active.current ? e.target.style.opacity = '0.3' : e.target.style.opacity = '1'
        }
      }
    }
    onClick={handleFilter}
    >
      {title}
    </span>
  )
}

export default Genre