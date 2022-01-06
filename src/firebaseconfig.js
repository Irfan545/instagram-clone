// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnXdCjuCjLRUcYEW5xUBZM0GtGy0FJizg",
  authDomain: "instaclone-80db8.firebaseapp.com",
  projectId: "instaclone-80db8",
  storageBucket: "instaclone-80db8.appspot.com",
  messagingSenderId: "331068418789",
  appId: "1:331068418789:web:a2011414171003cbbc420c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage= getStorage(app);
export const auth = getAuth(app);
export const db= getFirestore(app);
