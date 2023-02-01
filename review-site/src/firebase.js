// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getDoc, getFirestore, query, queryEqual, setDoc, where } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { useDispatch } from "react-redux";
import { setShownReviews } from "./slices/reviewsSlice";
import { serverTimestamp } from 'firebase/firestore'
import { FolderOpenIcon } from "@heroicons/react/24/solid";
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
      unhelpfuls: 0,
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

      // comments: [],
      // saves: 0,
      // helpfuls: 0,
      // unhelpfuls: 0,
      updatedTimestamp: serverTimestamp(),

      // relevanceScore: 0, //calculated on get from firestore based on the previous fields
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
      photoURL: photoURL ? photoURL : '',
      profileBgImageURL: '',
      // reviews: [],
      followers: [],
      following: [],
      dateJoined: serverTimestamp(),
      saves: [],
      helpfulReviews: [],
      unhelpfulReviews: [],
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
    const user = await getUserFromFirestore(userRef.id)
    return user
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
  const saves = []

  return {...review, id: reviewSnap.id, author: author, genre: genre}
}


export const getUserFromFirestore = async (uid) => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)
  const user = userSnap.data()
  
  return user 

}

export const getAuthorReviews = async (uid) => {
  const authorRef = doc(db, 'users', uid)
  const q = query(collection(db, 'reviews'), where('author', '==', authorRef))
  const reviews = []
  const reviewIds = []
  const convertedReviews = []

  const querySnapshot = await getDocs(q)

  querySnapshot.forEach(doc => {
    reviews.push(doc.data())
    reviewIds.push(doc.id)
  })

  for (let reviewId of reviewIds) {
    const review = await getReviewFromFirestore(reviewId)
    convertedReviews.push(review)
  }

  return convertedReviews


}

export const addReviewToUserSaved = async (reviewId, userId) => {
  const reviewRef = doc(db, 'reviews', reviewId)
  const authorRef = doc(db, 'users', userId)
  const author = await getDoc(authorRef)
  // console.log(author.data().saves[0].id)

  try {
    await setDoc(authorRef, {
      saves: !author.data().saves ? [reviewRef.id] : [...author.data().saves, reviewRef.id]//author?.saves?.length ? [...author.saves, reviewRef] : [reviewRef]
    }, {merge: true})
  } catch (e) {
    console.log(e)
  }

}

export const removeReviewFromUserSaved = async (reviewId, userId) => {
  const reviewRef = doc(db, 'reviews', reviewId)
  const authorRef = doc(db, 'users', userId)
  const author = await getDoc(authorRef)
  const saves = author.data().saves
  saves.splice(saves.indexOf(reviewRef.id), 1)

  try {
    await setDoc(authorRef, {
      saves: saves
    }, {merge: true})
  } catch (e) {
    console.log(e)
  }
}

export const getUserSavedReviews = async (userId) => {
  const user = await getUserFromFirestore(userId)
  const savedReviews = []
  // console.log("user saves: ", user.saves)
  
  if (user.saves) {
    for (let reviewId of user?.saves) {
      const review = await getReviewFromFirestore(reviewId)
      // console.log(review)
      savedReviews.push(review)
    }
  }
  // console.log("user saves: ", user.saves)
  return savedReviews
  
}

export const addHelpful = async (userId, reviewId) => {
  const userRef = doc(db, 'users', userId)
  const user = await getDoc(userRef)

  const reviewRef = doc(db, 'reviews', reviewId)
  const review = await getDoc(reviewRef)

  try {
    await setDoc(userRef, {
      helpfulReviews: user.data().helpfulReviews ? [...user.data().helpfulReviews, review.id] : [review.id]
    }, {merge: true})
    await setDoc(reviewRef, {
      helpfuls: review.data().helpfuls ? review.data().helpfuls + 1 : 1
    }, {merge: true})
  } catch (e) {
    console.log(e)
  }
}


export const removeHelpful = async (userId, reviewId) => {
  const userRef = doc(db, 'users', userId)
  const user = await getDoc(userRef)

  const reviewRef = doc(db, 'reviews', reviewId)
  const review = await getDoc(reviewRef)

  const userHelpfuls = user.data().helpfulReviews
  userHelpfuls.splice(userHelpfuls.indexOf(review.id), 1)
  console.log(userHelpfuls)

  try {
    await setDoc(userRef, {
      helpfulReviews: userHelpfuls
    }, {merge: true})
    await setDoc(reviewRef, {
      helpfuls: review.data().helpfuls - 1
    }, {merge: true})
  } catch (e) {
    console.log(e)
  }
}

export const addUnHelpful = async (userId, reviewId) => {
  const userRef = doc(db, 'users', userId)
  const user = await getDoc(userRef)

  const reviewRef = doc(db, 'reviews', reviewId)
  const review = await getDoc(reviewRef)

  try {
    await setDoc(userRef, {
      unhelpfulReviews: user.data().unhelpfulReviews ? [...user.data().unhelpfulReviews, review.id] : [review.id]
    }, {merge: true})
    await setDoc(reviewRef, {
      unhelpfuls: review.data().unhelpfuls ? review.data().unhelpfuls + 1 : 1
    }, {merge: true})
  } catch (e) {
    console.log(e)
  }
}

export const removeUnHelpful = async (userId, reviewId) => {
  const userRef = doc(db, 'users', userId)
  const user = await getDoc(userRef)

  const reviewRef = doc(db, 'reviews', reviewId)
  const review = await getDoc(reviewRef)

  const userUnHelpfuls = user.data().unhelpfulReviews
  userUnHelpfuls.splice(userUnHelpfuls.indexOf(review.id), 1)

  try {
    await setDoc(userRef, {
      unhelpfulReviews: userUnHelpfuls
    }, {merge: true})
    await setDoc(reviewRef, {
      unhelpfuls: review.data().unhelpfuls - 1
    }, {merge: true})
  } catch (e) {
    console.log(e)
  }
}

export const addCommentToReview = async (reviewId, userId, body, anonymous) => {

  try {
    const commentRef = await addDoc(collection(db, 'comments'), {
      review: reviewId,
      author: userId,
      body: body,
      dateCreated: serverTimestamp(),
      replies: [],
      likes: [], //array of ids of users who liked the comment
      dislikes: [],
      anonymous: anonymous, // whether or not the user is anonymous
    })  
    const reviewRef = doc(db, 'reviews', reviewId)
    const review = await getDoc(reviewRef)
    await setDoc(reviewRef, {
      comments: [...review.data().comments, commentRef.id]
    }, {merge: true})

    const comment = await getDoc(commentRef)
    return {...comment.data(), uid: comment.id}
  } catch (e) {
    console.error('Error adding comment to review: ', e)
  }
  return 
}

export const getComment = async (commentId) => {
  const commentRef = doc(db, 'comments', commentId)
  const commentSnapshot = await getDoc(commentRef)

  return {...commentSnapshot.data(), uid: commentSnapshot.id}
}

export const getReviewComments = async (reviewId) => {
  const reviewRef = doc(db, 'reviews', reviewId)
  const reviewSnapshot = await getDoc(reviewRef)
  let comments = []

  for (let comment of reviewSnapshot.data().comments) {
    await getComment(comment).then(comment => comments.push(comment))
  }

  return comments
}

export const addLikeToComment = async (commentId, userId) => {
  const commentRef = doc(db, 'comments', commentId)
  const comment = await getDoc(commentRef)

  await setDoc(commentRef, {
    likes: [...comment.data().likes, userId]
  }, {merge: true})
}


export const addDislikeToComment = async (commentId, userId) => {
  const commentRef = doc(db, 'comments', commentId)
  const comment = await getDoc(commentRef)

  await setDoc(commentRef, {
    dislikes: [...comment.data().dislikes, userId]
  }, {merge: true})
}

export const removeLikeFromComment = async (commentId, userId) => {
  const commentRef = doc(db, 'comments', commentId)
  const commentSnapshot = await getDoc(commentRef)

  try {
    const newCommentLikes = [...commentSnapshot.data().likes]
    newCommentLikes.splice(newCommentLikes.indexOf(userId), 1)

    await setDoc(commentRef, {
      likes: newCommentLikes
    }, {merge: true})
  } catch (e) {
    console.log('error removing like: ', e)
  }
}


export const removeDislikeFromComment = async (commentId, userId) => {
  const commentRef = doc(db, 'comments', commentId)
  const commentSnapshot = await getDoc(commentRef)

  try {
    const newCommentDislikes = [...commentSnapshot.data().dislikes]
    newCommentDislikes.splice(newCommentDislikes.indexOf(userId), 1)
    
    await setDoc(commentRef, {
      dislikes: newCommentDislikes
    }, {merge: true})
  } catch (e) {
    console.log('error removing like: ', e)
  }
}

export const addReplyToComment = async (commentId, userId, body) => {
  try {
    const replyRef = await addDoc(collection(db, 'replies'), {
      comment: commentId,
      author: userId,
      body: body,
      dateCreated: serverTimestamp(),
    })  
    const commentRef = doc(db, 'comments', commentId)
    const comment = await getDoc(commentRef)
    await setDoc(commentRef, {
      replies: [...comment.data().replies, replyRef.id]
    }, {merge: true})

    const reply = await getDoc(replyRef)
    return reply.data()
  } catch (e) {
    console.error('Error adding reply to comment: ', e)
  }
  return 
}

export const getReply = async (replyId) => {
  const replyRef = doc(db, 'replies', replyId)
  const reply = await getDoc(replyRef)

  console.log('reply from getReply: ', {...reply.data(), uid: reply.id})
  return {...reply.data(), uid: reply.id}
}

export const getCommentReplies = async (commentId) => {
  const commentRef = doc(db, 'comments', commentId)
  const commentSnapshot = await getDoc(commentRef)
  let replies = []

  // console.log('comment snapshot: ', commentSnapshot.data())
  for (let replyId of commentSnapshot.data().replies) {
    await getReply(replyId).then(reply => replies.push(reply))
  }

  return replies
}


export const addToUserFollowers = async (userId, followerId) => {
  const userRef = doc(db, 'users', userId)
  const userSnapshot = await getDoc(userRef)
  const userFollowers = [...userSnapshot.data().followers, followerId]

  await setDoc(userRef, {
    followers: userFollowers
  }, {merge: true})

  await addToFollowing(userId, followerId)
}

export const addToFollowing = async (userId, followerId) => {
  const followerRef = doc(db, 'users', followerId)
  const followerSnapshot = await getDoc(followerRef)
  const followerFollowing = [...followerSnapshot.data().following, userId]

  await setDoc(followerRef, {
    following: followerFollowing
  }, {merge: true})
}



export const removeFromUserFollowers = async (userId, followerId) => {
  const userRef = doc(db, 'users', userId)
  const userSnapshot = await getDoc(userRef)
  const userFollowers = [...userSnapshot.data().followers]

  const index = userFollowers.indexOf(followerId)
  userFollowers.splice(index, 1)

  await setDoc(userRef, {
    followers: userFollowers
  }, {merge: true})

  await removeFromFollowing(userId, followerId)
}

export const removeFromFollowing = async (userId, followerId) => {
  const followerRef = doc(db, 'users', followerId)
  const followerSnapshot = await getDoc(followerRef)
  const followerFollowing = [...followerSnapshot.data().following]
  
  const index = followerFollowing.indexOf(userId)
  followerFollowing.splice(index, 1)
  
  await setDoc(followerRef, {
    following: followerFollowing
  }, {merge: true})
}

export const updateUserProfilePic = async (userId, picPath) => {
  const userRef = doc(db, 'users', userId)

  try {
    await setDoc(userRef, {
      photoURL: picPath
    }, {merge: true})
  } catch (e) {
    console.log('error adding profile picture')
  }

}


export const updateUserBackgroundImage = async (userId, picPath) => {
  const userRef = doc(db, 'users', userId)

  try {
    await setDoc(userRef, {
      profileBgImageURL: picPath
    }, {merge: true})
  } catch (e) {
    console.log('error adding background Image')
  }

}

const addFieldToDoc = async (docType, fieldObj, id) => {
  const docRef = doc(db, docType, id)
  console.log('updating...')
  await setDoc(docRef, fieldObj, {merge: true})

}

const links = {
  links: {
    youtube: 'https://www.youtube.com',
    tiktok: 'https://www.tiktok.com',
    instagram: 'https://www.instagram.com',
    twitter: 'https://www.twitter.com',
    facebook: 'https://www.facebook.com',
    gmail: '',
    linkedIn: 'https://www.linkedIn.com',
  }
}

addFieldToDoc('users', links, 'cYMpWrnMXReaWMUGnI8eKFz02WW2')

// const addFieldsToDocs = async (docType, fieldObj) => {
//   const querySnapshot = await getDocs(collection(db, docType));
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });
// }