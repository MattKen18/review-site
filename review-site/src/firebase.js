// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDoc, getFirestore, query } from "firebase/firestore";
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


  const querySnapshot = await getDocs(collection(db, 'reviews'))
  const shownReviews = []
  querySnapshot.forEach(doc => {
    shownReviews.push(doc.data())
  })

  for (let i=0; i < shownReviews.length; i++) {
    const review = shownReviews[i]
    // console.log(review)
    try {
      const { helpfuls, comments, saves, timestamp } = review
      // console.log(helpfuls, comments.length, saves, timestamp)
      const relevanceScore = Math.round(helpfuls*weights['helpfuls'] + comments.length*weights['comments'] + saves*weights['saves'] + (timestamp*10**-9)*weights['timestamp']*100)/100
      review.relevanceScore = relevanceScore
      console.log(review.relevanceScore)
      shownReviews = shownReviews.sort((a, b) => b.relevanceScore - a.relevanceScore)
      // console.log(shownReviews)
    } catch (e) {
      
    }
    //then sort based on timestamp of the reviews
  }
  console.log(shownReviews)
  return shownReviews
}


export const addReviewToFireStore = async ({ author, headline, body, genre, tag, images, rating}) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      author: author,
      headline: headline,
      body: body,
      genre: genre, //convert to use the genre id, get that genre from firestone and then use it here
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
  }
}