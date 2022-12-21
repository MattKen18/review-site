import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import {clearFilter, selectAuthFiltering, selectFiltering, selectGenreFiltering, selectMossFiltering } from '../slices/filterSlice'
import Genre from './Genre'
import Rating from './Rating'
import RadioFilter from './RadioFilter'
import { addGenre, getGenresFromFireStore } from '../firebase'

const SidePane = () => {

  const [genres, setGenres] = useState([])

  const dispatch = useDispatch()
  const genreFiltering = useSelector(selectGenreFiltering)
  const mossFiltering = useSelector(selectMossFiltering)
  const authFiltering = useSelector(selectAuthFiltering)
  
  useEffect(() => {
    getGenresFromFireStore().then(genres => setGenres(genres))
  }, [])

  useEffect(() => {
    // console.log(genres)
  }, [genres])
  
  return (
    <>
      <div className='h-screen border-r-2 border-slate-200 px-5 pt-10 fixed w-1/6 select-none bg-white'>
        <div className='relative'>
          <h1 className='text-xl text-slate-500 font-bold px-2 py-1'>Genres</h1>
          {
            (genreFiltering || mossFiltering || authFiltering) && 
            <button className='absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2' onClick={() => dispatch(clearFilter())}>
              <XMarkIcon className='w-6 text-red-700' />
            </button>
          }
        </div>

        <ul className='mt-3 font-display'>
          {/* convert to map with dynamic background colors for each category pulled from database */}
          {genres.map((genre, key) => (
            <li key={key} className='my-3 ml-2 transition ease-in-out duration-300 hover:scale-110 inline-block'>
              <Genre genre={genre} />
            </li>
          ))}
        </ul>
        <div className='mt-12 pl-2'>
          <h1 className='font-bold text-xl text-slate-500'>Moss Rating <span>≤</span></h1>
          <div className='flex flex-col mt-3 border-2 border-slate-50 rounded-md bg-slate-50 w-3/4'>
            {
              [5, 4, 3, 2, 1].map(mossRating => (
                <div key={mossRating} className='basis-1/5 relative w-full p-1'>
                  <Rating mossRating={mossRating} />
                </div>
              ))
            }
          </div>
        </div>
        <div className='mt-12'>
          <RadioFilter details={{
            ids: ['verified', 'unverified'],
            name: 'authenticated',
            values: ['verified', 'unverified'],
            radioValues: ['Verified', 'Unverified'],
          }} />
        </div>
        {/* <div className='mt-8'>
          <RadioFilter details={{
            ids: ['newest', 'oldest'],
            name: 'upload date',
            values: ['newest', 'oldest'],
            radioValues: ['Newest First', 'Oldest First'],
          }} />
        </div> */}
      </div>
    </>
  )
}

export default SidePane