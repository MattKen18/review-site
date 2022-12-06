import React, { useEffect, useRef } from 'react';
import { addToFireStore, getFromFireStore } from '../../firebase';
import AddSpace from '../AddSpace';
import { useSelector } from 'react-redux';
import { selectAuthFiltering, selectFiltering, selectFilters, selectGenreFiltering, selectMossFiltering } from '../../slices/filterSlice';

const Home = () => {
  const createdUser = useRef(false)
  const filters = useSelector(selectFilters)
  const genreFiltering = useSelector(selectGenreFiltering)
  const mossFiltering = useSelector(selectMossFiltering)
  const authFiltering = useSelector(selectAuthFiltering)

  useEffect(() => {
    // if (createdUser.current) return; //strict mode makes it run twice so using useRef keeps track of if it was already ran
    // addToFireStore();
    // getFromFireStore();
    // createdUser.current = true;
  }, []);


  return (
    <div className='basis-4/6 bg-gray-100'>
        <h1 className='text-4xl text-slate-500 font-extrabold text-center mt-10'>Home</h1>
        <div className='mt-20 w-1/5 m-auto'>
        {
          genreFiltering || mossFiltering || authFiltering ? 
          <>
            <h2 className='text-center'>Filtering...</h2>
            <ul>
              {filters.map((filter, i) => (
                <li key={i} className='block text-center'>{filter}</li>
              ))}
            </ul>
            </>
          : 
          <p className='text-center'>Not Filtering</p>
        }
        </div>
  
    </div>
  )
}

export default Home;