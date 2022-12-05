import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import {clearFilter, removeFilter, selectFiltering } from '../slices/filterSlice'
import Genre from './Genre'
import Rating from './Rating'

const SidePane = () => {
  const genres = [
    {
      title: 'Books',
      color: 'bg-rose-600',
      border: 'border-rose-600'
    },
    {
      title: 'Music',
      color: 'bg-emerald-900',
      border: 'border-emerald-900'
    },
    {
      title: 'Games',
      color: 'bg-teal-600',
      border: 'border-teal-600'
    },
    {
      title: 'Restaurants',
      color: 'bg-fuchsia-500',
      border: 'border-fuchsia-500'
    },
    {
      title: 'Technology',
      color: 'bg-green-400',
      border: 'border-green-400'
    },
    {
      title: 'TV Shows/Movies',
      color: 'bg-yellow-700',
      border: 'border-yellow-700'
    },
    {
      title: 'Hotels/Resorts',
      color: 'bg-stone-700',
      border: 'border-stone-700'
    },
    {
      title: 'Misc',
      color: 'bg-gray-600',
      border: 'border-gray-600'
    },
    {
      title: 'Anime',
      color: 'bg-teal-200',
      border: 'border-teal-200'
    },
  ]

  const dispatch = useDispatch()
  const isFiltering = useSelector(selectFiltering)

  return (
    <div className='h-screen border-r-2 border-slate-200 px-5 pt-10 fixed w-1/6'>
      <div className='relative'>
        <h1 className='text-xl text-slate-500 font-bold px-2 py-1'>Genres</h1>
        {
          isFiltering && 
          <a href='#' className='absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2' onClick={() => dispatch(clearFilter())}>
            <XMarkIcon className='w-6 text-red-700' />
          </a>
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
      <div className='mt-12 pl-2 select-none'>
        <h1 className='font-bold text-xl text-slate-500'>Moss Rating</h1>
        <div className='flex flex-col mt-3 border-2 border-slate-50 rounded-md bg-slate-50 w-3/4 h-full'>
          {
            [5, 4, 3, 2, 1].map(mossRating => (
              <div key={mossRating} className='basis-1/5 relative w-full p-1 mb-1 last:mb-0'>
                <Rating mossRating={mossRating} />
              </div>
            ))
          }
        </div>
      </div>
      <div className='mt-12'>
          <form action="/" className='font-light text-sm text-slate-500'>
            <div className='flex items-center mb-3'>
              <input 
              type="radio" 
              id="verified" 
              name="authenticated" 
              value="verified"
              defaultChecked
              className='appearance-none h-5 w-5 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer' 
              />
              <label htmlFor="verified" className='pl-3 hover:cursor-pointer'>Verified</label>
            </div>
            <div className='flex items-center'>
              <input 
              type="radio" 
              id="unverified" 
              name="authenticated" 
              value="unverified" 
              className='appearance-none h-5 w-5 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer' 
              />
              <label htmlFor="unverified" className='pl-3 hover:cursor-pointer'>Unverified</label>
            </div>
          </form>
      </div>
      <div className='mt-8'>
          <form action="/" className='font-light text-sm text-slate-500'>
            <div className='flex items-center mb-3'>
              <input 
              type="radio" 
              id="newest" 
              name="upload date" 
              value="newest"
              defaultChecked
              className='appearance-none h-5 w-5 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer' 
              />
              <label htmlFor="newest" className='pl-3 hover:cursor-pointer'>Newest First</label>
            </div>
            <div className='flex items-center'>
              <input 
              type="radio" 
              id="oldest" 
              name="upload date" 
              value="oldest" 
              className='appearance-none h-5 w-5 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer' 
              />
              <label htmlFor="oldest" className='pl-3 hover:cursor-pointer'>Oldest First</label>
            </div>

          </form>
      </div>
    </div>
  )
}

export default SidePane