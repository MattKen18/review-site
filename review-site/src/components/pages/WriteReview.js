import { jsonEval } from '@firebase/util'
import React, { useEffect, useState } from 'react'
import { addReviewToFireStore, getGenresFromFireStore } from '../../firebase'

const WriteReview = () => {
  const [reviewCreated, setReviewCreated] = useState(false)
  const [genres, setGenres] = useState([])


  useEffect(() => {
    getGenresFromFireStore().then(genres => setGenres(genres))
  }, []) 


  const addReview  = (e) => {
    e.preventDefault()
    const author = "Matthew Carby"
    const headline = document.getElementById('review-headline').value
    const genre = JSON.parse(document.getElementById('review-genre').value)
    const tag = document.getElementById('review-tag').value
    const body = document.getElementById('review-body').value
    const rating = Number(document.getElementById('review-rating').value)
    const images = []
  
    const formData = {
      author: author,
      headline: headline,
      genre: genre,
      tag: tag,
      body: body,
      rating: rating,
      images: images,
    }


    addReviewToFireStore(formData)
    .then(() => {
      document.getElementById('write-review-form').reset()
      setReviewCreated(true)
      window.scrollTo(0, 0);
    })   
  }
  

  
  return (
    <div className='mb-10'>
      {
        reviewCreated &&       
      
      <div className='w-full my-10'>
        <h1 className='text-blue-600 text-center'>Successfully Published Review!! {' :)'}</h1>
      </div>
      }

      <h1 className='text-center text-3xl font-bold'>Write Review</h1>
      <div className='h-[1000px] w-11/12 mt-20 m-auto bg-white rounded-md p-10'>
        <form id='write-review-form' className='text-slate-500 h-full flex flex-col space-y-4' onSubmit={e => addReview(e)}>
          <div className='relative w-full flex flex-col items-start h-fit font-bold'>
            {/* <label htmlFor="review-headline">Headline:</label> */}
            <input 
              type='text'
              name='headline'
              id='review-headline' 
              placeholder=' '
              className='peer w-full rounded-md p-2 px-4 font-lg border-2 border-slate-300 focus:outline-papaya focus:outline-2 focus:border-transparent placeholder-transparent'
              autoComplete='off'
              required
              autoFocus
            />
            <label 
              id='review-headline-label'
              htmlFor='review-headline'
              className='absolute left-4 -top-[10px] text-blue-500 bg-white text-sm duration-100 px-1 hover:cursor-text peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-500 peer-focus:text-sm peer-focus:text-papaya peer-focus:-top-[10px]'
            >
              Headline
            </label>
          </div>
          <div>
            <select name="genre" id="review-genre" className='border-2 border-slate-300 rounded-md p-2 px-4 focus:border-papaya focus:outline-papaya text-sm'>
              {
                genres.map((genre, i) => (
                  <option key={i} value={JSON.stringify(genre)}>{genre.title}</option>
                ))
              }
            </select>
          </div>

          <div className='relative w-full flex flex-col items-start h-20 text-sm'>
            {/* <label htmlFor="review-headline">Headline:</label> */}
            <input 
              type='text'
              name='tag'
              id='review-tag' 
              placeholder=' '
              className='peer w-full rounded-md p-2 px-4 text-sm font-light border-2 border-slate-300 focus:outline-papaya focus:outline-2 focus:border-transparent placeholder-transparent'
              autoComplete='off'
            />
            <small>E.g. The Twilight Saga: New Moon</small>
            <label 
              id='review-tag-label'
              htmlFor='review-tag'
              className='absolute left-4 -top-[10px] text-blue-500 bg-white text-sm duration-100 px-1 hover:cursor-text peer-placeholder-shown:left-4 peer-placeholder-shown:top-[10px] peer-placeholder-shown:text-slate-500 peer-focus:text-sm peer-focus:text-papaya peer-focus:-top-[10px]'
            >
              Tag
            </label>
          </div>

          <div className='relative w-full flex flex-col items-start'>
            <textarea name="body" id="review-body" placeholder=' ' required
              className='peer w-full h-96 p-4 border-2 border-slate-300 rounded-md focus:outline-papaya focus:outline-2 placeholder-transparent' 
            />
            <label htmlFor="review-body" className='absolute -top-[10px] left-4 text-blue-500 duration-100 bg-white px-1 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 hover:cursor-text peer-focus:text-papaya peer-focus:text-sm peer-focus:-top-[10px]'
            >
              Body
            </label>
          </div>
          <div className='relative flex-1 flex flex-col items-start w-fit'>
            <input id='review-rating' name='review-rating' type='number' min={1} step={0.5} max={5} placeholder=' ' 
              className='peer font-bold border-2 border-slate-300 rounded-md p-2 w-16 placeholder-transparent focus:outline-2 focus:outline-papaya'
              required
            />
            <label 
              id='review-rating-label'
              htmlFor="review-rating"
              defaultValue={5}
              className='absolute text-xs -top-[8px] left-1/2 -translate-x-1/2 bg-white px-1 py-0 text-blue-500 peer-placeholder-shown:top-[5px] peer-placeholder-shown:text-slate-500 peer-placeholder-shown:py-2 peer-focus:-top-[8px] peer-focus:py-0 peer-focus:text-papaya duration-100'
            >
              Rating
            </label>
            <small className='w-full text-xs text-center'>1-5 stars</small>
          </div>
          <div className='flex w-full items-center justify-center'>
            <button type='submit' className='w-20 border-2 border-papaya bg-papaya rounded-md text-white p-2 focus:outline-papaya'>Publish</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteReview