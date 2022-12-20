import React, { useEffect, useRef, useState } from 'react';
import { addGenre, addToFireStore, convertShownReviews, getFromFireStore, getShownReviews } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectAuthFiltering, selectFilters, selectGenreFiltering, selectMossFiltering } from '../../slices/filterSlice';
import Review from '../Review';
import { useDispatch } from 'react-redux';
import LoadingAnimation from 'react-loading';
import ReviewPlaceholder from '../ReviewPlaceholder';

const Home = () => {
  const createdUser = useRef(false)
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const genreFiltering = useSelector(selectGenreFiltering)
  const mossFiltering = useSelector(selectMossFiltering)
  const authFiltering = useSelector(selectAuthFiltering)

  const [shownReviews, setShownReviews] = useState([])

  const alreadyShown = useRef(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // if (createdUser.current) return; //strict mode makes it run twice so using useRef keeps track of if it was already ran
    // addToFireStore();
    // getFromFireStore();
    // createdUser.current = true;

    getShownReviews().then(data => { 
      setLoading(false)
      convertShownReviews(data).then(data => setShownReviews(data))
    })

    if (alreadyShown.current) {
      // getShownReviews().then(data =>{
      //   setShownReviews(data)}
      // )
      getShownReviews().then(data => convertShownReviews(data).then(data => setShownReviews(data)))

    }
    alreadyShown.current = true

  }, []);

  

  useEffect(() => {
    if (alreadyShown.current) {
      console.log(shownReviews)
    }
    alreadyShown.current = true

  }, [shownReviews])


  const reviews = [{
    author: 'Matthew Carby',
    headline:'Not as we expected ected this movie to b ected this',
    body:`I too expected this movie to be better. I read the 4 books. The thing is they cut out the best lines from the books which can add SO much to the movies. 
    I was looking forward to some seens in the movie: Edward proposal for Bella, when they talk while they are waiting to get out the Volturi, very romantic and whilte 
    they are in plane going back home. I think the scenarist must be replaced or the writer should oversee the script. The only reason movies are hit cause of the books only. 
    Most people who did not read the books did not like the movies. Hope they'll do better in the 3rd one. But I really hope they'll do much much better in the 4th movie cause 
    this is the book I'd like most. In general, if you read the books you must watch the movies, its nice to have the characters & seens a life.  to be better. I read the 4 books. Th
    to be better. I read the 4 books. Th to be better. I read the 4 books. Th to be better. I read the 4 books. Th to be better. I read the 4 books. Th to be better. I read the 4 books. Th
    to be better. I read the 4 books. Th to be better. I read the 4 books. Th`,
    genre: {
      title: 'Books',
      color: 'bg-rose-600',
      border: 'border-rose-600'
    },
    tag: 'The Twilight Saga: New Moon',
    age:'15 hours', //how long ago it was created
    images: ['https://test-image-store-weviews.s3.us-east-2.amazonaws.com/new-moon.jpg', 'https://test-image-store-weviews.s3.us-east-2.amazonaws.com/new-moon2.jpg', 'https://test-image-store-weviews.s3.us-east-2.amazonaws.com/new-moon3.jpg'], //might be empty
    numOfComments:25,
    rating: 3.5,
  },
  {
    author: 'Matthew Carby',
    headline:'Not as we expected',
    body:`I too expected this movie to be better. I read the 4 books. The thing is they cut out the best lines from the books which can add SO much to the movies. 
    `,
    genre: {
      title: 'Technology',
      color: 'bg-green-400',
      border: 'border-green-400'
    },
    tag: 'The Twilight Saga: New Moon',
    age:'15 hours', //how long ago it was created
    images: ['https://test-image-store-weviews.s3.us-east-2.amazonaws.com/new-moon.jpg', 'https://test-image-store-weviews.s3.us-east-2.amazonaws.com/new-moon2.jpg', 'https://test-image-store-weviews.s3.us-east-2.amazonaws.com/new-moon3.jpg'], //might be empty
    numOfComments:25,
    rating: 5,
  },
  {
    author: 'Matthew Carby',
    headline:'Not as we expected',
    body:`I too expected this movie to be better. I read the 4 books. The thing is they cut out the best lines from the books which can add SO much to the movies. 
    I was looking forward to some seens in the movie: Edward proposal for Bella, when they talk while they are waiting to get out the Volturi, very romantic and whilte 
    they are in plane going back home. I think the scenarist must be replaced or the writer should oversee the script. The only reason movies are hit cause of the books only. 
    Most people who did not read the books did not like the movies. Hope they'll do better in the 3rd one. But I really hope they'll do much much better in the 4th movie cause 
    this is the book I'd like most. In general, if you read the books you must watch the movies, its nice to have the characters & seens a life.`,
    genre: {
      title: 'Books',
      color: 'bg-rose-600',
      border: 'border-rose-600'
    },
    tag: 'The Twilight Saga: New Moon',
    age:'15 hours', //how long ago it was created
    images:[], //might be empty
    numOfComments:25,
    rating: 4.5,
  },
  {
    author: 'Matthew Carby',
    headline:'Not as we expected',
    body:`I too expected this movie to be better. I read the 4 books. The thing is they cut out the best lines from the books which can add SO much to the movies. 
    I was looking forward to some seens in the movie: Edward proposal for Bella, when they talk while they are waiting to get out the Volturi, very romantic and whilte 
    they are in plane going back home. I think the scenarist must be replaced or the writer should oversee the script. The only reason movies are hit cause of the books only. 
    Most people who did not read the books did not like the movies. Hope they'll do better in the 3rd one. But I really hope they'll do much much better in the 4th movie cause 
    this is the book I'd like most. In general, if you read the books you must watch the movies, its nice to have the characters & seens a life.`,
    genre: {
      title: 'Books',
      color: 'bg-rose-600',
      border: 'border-rose-600'
    },
    tag: 'The Twilight Saga: New Moon',
    age:'15 hours', //how long ago it was created
    images:[], //might be empty
    numOfComments:25,
    rating: 4,
  },
  {
    author: 'Matthew Carby',
    headline:'Not as we expected',
    body:`I too expected this movie to be better. I read the 4 books. The thing is they cut out the best lines from the books which can add SO much to the movies. 
    I was looking forward to some seens in the movie: Edward proposal for Bella, when they talk while they are waiting to get out the Volturi, very romantic and whilte 
    they are in plane going back home. I think the scenarist must be replaced or the writer should oversee the script. The only reason movies are hit cause of the books only. 
    Most people who did not read the books did not like the movies. Hope they'll do better in the 3rd one. But I really hope they'll do much much better in the 4th movie cause 
    this is the book I'd like most. In general, if you read the books you must watch the movies, its nice to have the characters & seens a life.`,
    genre: {
      title: 'Books',
      color: 'bg-rose-600',
      border: 'border-rose-600'
    },
    tag: 'The Twilight Saga: New Moon',
    age:'15 hours', //how long ago it was created
    images:[], //might be empty
    numOfComments:25,
    rating: 3.5,
  }]


  return (
    <div className=''>
        <div className='w-11/12 m-auto'>
          <h1 className='text-3xl font-bold text-center mb-3 pl-10'>Your Feed</h1>
          {/* <hr /> */}

        </div>
        {
          !loading ?
          <div className='mt-20 m-auto'>
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
            <>
              {shownReviews.map((review, i) => (
                <Review key={i} id={i} review={review} />
              )) 
              }

            </>
          }
          </div>
          :
          <div className='mt-20 m-auto'>
            <ReviewPlaceholder />
            <ReviewPlaceholder />
            <ReviewPlaceholder />
            <ReviewPlaceholder />
            <ReviewPlaceholder />
          </div>

        }
  
    </div>
  )
}

export default Home;