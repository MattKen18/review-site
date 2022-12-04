import React, { useEffect, useRef } from 'react';
import { addToFireStore, getFromFireStore } from '../../firebase';

const Home = () => {
  const createdUser = useRef(false);

  useEffect(() => {
    // if (createdUser.current) return; //strict mode makes it run twice so using useRef keeps track of if it was already ran
    // addToFireStore();
    // getFromFireStore();
    // createdUser.current = true;
  }, []);


  return (
    <div className='basis-5/6 bg-gray-100'>
        <h1 className='text-4xl text-slate-500 font-extrabold text-center'></h1>
    </div>
  )
}

export default Home;