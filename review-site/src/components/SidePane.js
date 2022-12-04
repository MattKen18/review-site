import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

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
    // {
    //   title: 'Hotels/Resorts',
    //   color: 'bg-stone-700',
    //   border: 'border-stone-700'
    // },
    // {
    //   title: 'Hotels/Resorts',
    //   color: 'bg-stone-700',
    //   border: 'border-stone-700'
    // },
  ]

  return (
    <div className='h-screen border-r-2 border-slate-200 px-5 pt-10 fixed w-1/6'>
      <h1 className='text-xl text-slate-500 font-bold px-2 py-1'>Genres</h1>
      <ul className='mt-3 font-display'>
        {/* convert to map with dynamic background colors for each category pulled from database */}
        {genres.map((genre, key) => (
          <li key={key} className='my-3 ml-2 transition ease-in-out duration-300 hover:scale-110 inline-block'>
            <a href="/" className={`p-2 mb-2 ${genre.color} text-sm text-white border-2 ${genre.border} rounded-full`}>
              {genre.title}
            </a>
          </li>
        ))}
      </ul>
      <div className='mt-12 pl-2'>
        <h1 className='font-bold text-xl text-slate-500'>Moss Score</h1>
        <ul className='mt-3 border-2 border-slate-50 rounded-md bg-slate-50 w-fit'>
          {
            [5, 4, 3, 2, 1].map(star => (
              <li key={star} className='mb-1'>
                <a href='/' className='flex items-center hover:bg-slate-200 hover:rounded-lg p-1'>
                  <span className='mr-2 w-2 font-thin'>{star}.</span>
                  <div className='flex'>
                    {
                      Array.from({ length: star }).map((a, i) => (<StarIcon key={i} className='w-4 text-moss'/>))
                    }
                  </div>
                </a>
              </li>
            ))
          }
        </ul>
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