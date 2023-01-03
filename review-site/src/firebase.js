// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getDoc, getFirestore, query, queryEqual, setDoc } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { useDispatch } from "react-redux";
import { setShownReviews } from "./slices/reviewsSlice";
import { serverTimestamp } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'

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
// const auth = getAuth(app);

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
    let review = doc.data()
    review.id = doc.id
    shownReviews.push(review)
  })

  for (let i=0; i < shownReviews.length; i++) {
    const review = shownReviews[i]
    try {
      const { helpfuls, comments, saves, timestamp } = review
      const relevanceScore = Math.round(helpfuls*weights['helpfuls'] + comments.length*weights['comments'] + saves*weights['saves'] + (timestamp*10**-9)*weights['timestamp']*100)/100
      review.relevanceScore = relevanceScore
      shownReviews = shownReviews.sort((a, b) => b.timestamp - a.timestamp)
    } catch (e) {
      
    }
  }
  // for (let x=0; x<shownReviews.length; x++) {
  //   // console.log("genre from firebase:", shownReviews[x].genre)
  // }
  return shownReviews
}

export const convertShownReviews = async (reviews) => { //convert reference fields to actual objects that can be used in frontend
  for (let i=0; i<reviews.length; i++) {
    const genreRef = doc(db, 'genres', reviews[i].genre.id)
    const genreSnap = await getDoc(genreRef)

    // console.log("author: ", reviews[i].author.id)
    if (reviews[i].author.id) {
      const authorRef = doc(db, 'users', reviews[i].author.id)
      const authorSnap = await getDoc(authorRef)
      reviews[i].author = authorSnap.data()
    }

    reviews[i].genre = genreSnap.data ()

      // console.log(reviews[i])
  }
  return reviews
}


// getShownReviews().then(data => convertShownReviews(data).then(data => console.log('reviews from firestore:', data)))


export const addReviewToFireStore = async ({ author, headline, body, genre, tag, images, rating}) => {
  try {
    const genreObj = JSON.parse(genre)
    const genreRef = doc(db, 'genres', genreObj.title)
    const genreDoc = await getDoc(genreRef)
    
    const authorRef = doc(db, 'users', author) //author is the uid of the currently logged in author

    const docRef = await addDoc(collection(db, "reviews", ), {
      author: authorRef, // so as to have a reference to the user in firestore that corresponds to the user in firebase auth (whenever a user is created in firebase auth, I create a corresponding user doc in firestore)
      headline: headline,
      body: body,
      genre: genreRef, //convert to use the genre id, get that genre from firestore and then use it here
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

export const updateReviewInFirestore = async ({ reviewId, author, headline, body, genre, tag, images, rating}) => {
  try {
    const genreObj = JSON.parse(genre)
    const genreRef = doc(db, 'genres', genreObj.title)

    const reviewRef = doc(db, 'reviews', reviewId)
    await setDoc(reviewRef, {
      headline: headline,
      body: body,
      genre: genreRef, //convert to use the genre id, get that genre from firestore and then use it here
      tag: tag,
      images: images, //might be an []
      rating: rating, 

      comments: [],
      saves: 0,
      helpfuls: 0,
      updatedTimestamp: serverTimestamp(),

      relevanceScore: 0, //calculated on get from firestore based on the previous fields
    }, {merge: true})
  } catch (e) {
    console.log("error updating review: ", e)
  }
}


export const addUserToFirestore  = async ({uid, displayName, email, photoURL}) => { //whenever a user is created using firebase auth, I create a user doc containing only these fields making it more accessible
  try {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, {
      uid: uid,
      userName: displayName,
      email: email,
      photoURL: photoURL ? photoURL : "",
      // reviews: [],
      followers: [],
    }, {merge: true})
    // userRef = await setDoc(doc(db, 'users', uid), {
    //   uid: uid,
    //   userName: displayName,
    //   email: email,
    //   photoUrl: photoUrl? photoUrl : "",
    //   // reviews: [],
    //   followers: [],
    // })

    console.log("user created in firestore")
  } catch (e) {
    console.log(e)
  }
}

export const getReviewFromFirestore = async (id) => { //gets the review and converts the reference fields to usable objects
  const reviewRef = doc(db, 'reviews', id)
  const reviewSnap = await getDoc(reviewRef)
  const review = reviewSnap.data()

  const genreRef = doc(db, 'genres', reviewSnap.data().genre.id)
  const genreSnap = await getDoc(genreRef)
  const genre = genreSnap.data()

  const authorRef = doc(db, 'users', reviewSnap.data().author.id)
  const authorSnap = await getDoc(authorRef)
  const author = authorSnap.data()

  return {...review, author: author, genre: genre}
}

