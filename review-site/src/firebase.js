// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 


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
    try {
      const docRef = await addDoc(collection(db, "users"), {
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

export async function getFromFireStore() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}
