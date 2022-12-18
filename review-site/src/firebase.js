// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getDoc, getFirestore, query, queryEqual, setDoc } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { useDispatch } from "react-redux";
import { setShownReviews } from "./slices/reviewsSlice";
import { serverTimestamp } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhzKr50ZMYVHqi6fsvvodmkyEv_N84OBM",
  authDomain: "reviews-site-8a0b4.firebaseapp.com",
  projectId: "reviews-site-8a0b4",
  storageBucket: "reviews-site-8a0b4.appspot.com",
  messagingSenderId: "326866330190",
  appId: "1:326866330190:web:3ae190d0ebc4dc3096991f",
  measurementId: "G-YYY2X50BZP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function addToFireStore() {
  const collection = collection(db, "users")
  try {
    const docRef = await addDoc(collection, {
      first: "Alan",
      middle: "Mathison",
      last: "Turing",
      born: 1912
    });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
  }
}

export const getGenresFromFireStore = async () => {
  const genresQuery = query(collection(db, 'genres'))
  const querySnapshot = await getDocs(genresQuery)

  const genres = []
  querySnapshot.forEach(doc => genres.push(doc.data()))
  return genres
}

export const getShownReviews =  async () => {
  const weights = {
    'helpfuls': .5,
    'comments': .3,
    'saves': .1,
    'timestamp': .1
  }

  let shownReviews = []
  const querySnapshot = await getDocs(collection(db, 'reviews'))
  querySnapshot.forEach(doc => {
    shownReviews.push(doc.data())
  })
  
  // const getGenreObj = async (review) => {
  //   const docRef = doc(db, 'genres', review.genre.id)
  //   const docSnap = await getDoc(docRef)
  //   return docSnap

  // }

  // querySnapshot.forEach(async (doc) => {
  //   if (doc.data().genre.id) {
  //     const review = doc.data()
  //     shownReviews.push(review)
    
  //     console.log(shownReviews)

  //     const genre = await getGenreObj(doc.data()).then(d => d.data())
  //     review.genre = genre

  //   } else {
  //     console.log('no ID')
  //   }
  // })
  // console.log(shownReviews)



  // querySnapshot.forEach(async (d) => {
  //   const review = d.data()

  //   if (review.genre.id) {
  //     const docRef = doc(db, 'genres', review.genre.id)
  //     const docSnap = await getDoc(docRef).then(data => {
  //       review.genre = data.data()
  //       shownReviews.push(review)
  //     })
  //   }
  //   shownReviews.push(review)
    
    // try {
    //   console.log(review.genre)
    //   const docRef = doc(db, 'genres', review.genre.id)
    //   const docSnap = await getDoc(docRef)
      
    //   if (docSnap.exists()) {
    //     review.genre = docSnap.data()
    //   } else {
    //   }
    // } catch (e) {
    // }
    // shownReviews.push(review)

  // })

  // const convertGenreToObj = async () => {
  //   for (const review of shownReviews) {
  //     try {
  //       const docRef = doc(db, 'genres', review.genre.id) //get the genre object from the reference that is stored
  //       const docSnapshot = await getDoc(docRef).then(data => review['genre'] = data.data())
  //       console.log(review)
  //       // review.genre = docSnapshot.data()
  //     } catch (e) {
  //       console.log("Review does not have genre reference")
  //     }
  //   }
  // }

  // convertGenreToObj()

  // shownReviews.forEach(async review => {
  //   try {
  //     const docRef = doc(db, 'genres', review.genre.id) //get the genre object from the reference that is stored
  //     const docSnapshot = await getDoc(docRef).then(data => review.genre = data.data())
  //     // review.genre = docSnapshot.data()
  //   } catch (e) {
  //     console.log("Review does not have genre reference")
  //   }

  // })

  for (let i=0; i < shownReviews.length; i++) {
    const review = shownReviews[i]
    try {
      const { helpfuls, comments, saves, timestamp } = review
      const relevanceScore = Math.round(helpfuls*weights['helpfuls'] + comments.length*weights['comments'] + saves*weights['saves'] + (timestamp*10**-9)*weights['timestamp']*100)/100
      review.relevanceScore = relevanceScore
      shownReviews = shownReviews.sort((a, b) => b.relevanceScore - a.relevanceScore)
    } catch (e) {
      
    }
  }
  // for (let x=0; x<shownReviews.length; x++) {
  //   // console.log("genre from firebase:", shownReviews[x].genre)
  // }
  return shownReviews
}

export const convertShownReviews = async (reviews) => {
  for (let i=0; i<reviews.length; i++) {
    if (reviews[i].genre.id) {
      const docRef = doc(db, 'genres', reviews[i].genre.id)
      const docSnap = await getDoc(docRef)
      reviews[i].genre = docSnap.data()
      // console.log(reviews[i])
    }
  }
  return reviews
}


getShownReviews().then(data => convertShownReviews(data).then(data => console.log('reviews from firestore:', data)))


export const addReviewToFireStore = async ({ author, headline, body, genre, tag, images, rating}) => {
  try {
    const genreObj = JSON.parse(genre)
    const genreRef = doc(db, 'genres', genreObj.title)
    const genreDoc = await getDoc(genreRef)
    // console.log(genreDoc.data())

    const docRef = await addDoc(collection(db, "reviews", ), {
      author: author,
      headline: headline,
      body: body,
      genre: genreRef, //convert to use the genre id, get that genre from firestone and then use it here
      tag: tag,
      images: images, //might be an []
      rating: rating, 

      comments: [],
      saves: 0,
      helpfuls: 0,
      timestamp: serverTimestamp(),

      relevanceScore: 0, //calculated on get from firestore based on the previous fields
    })
  } catch (e) {
    console.error("Error adding document")
    console.log(e)
  }
}

// const genres = [
//   {
//     title: 'Books',
//     color: '#e11d48',
//   },
//   {
//     title: 'Music',
//     color: '#064e3b',
//   },
//   {
//     title: 'Games',
//     color: '#0d9488',
//   },
//   {
//     title: 'Restaurants',
//     color: '#c026d3',
//   },
//   {
//     title: 'Technology',
//     color: '#4ade80',
//   },
//   {
//     title: 'TV Shows-Movies',
//     color: '#a16207',
//   },
//   {
//     title: 'Hotels-Resorts',
//     color: '#44403c',
//   },
//   {
//     title: 'Misc',
//     color: '#4b5563',
//   },
//   {
//     title: 'Anime',
//     color: '#5eead4',
//   },
// ]

// export const addGenres = async () => {
//   for (let genre of genres) {
//     const docRef = collection(db, 'genres')
//     await setDoc(doc(docRef, genre.title), genre)
//   }
// }


// addGenres()