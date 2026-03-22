// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHXBO4c6zDu8T-8uRdPJPkHOrl_voHVFA",
  authDomain: "peacehub-a5219.firebaseapp.com",
  projectId: "peacehub-a5219",
  storageBucket: "peacehub-a5219.firebasestorage.app",
  messagingSenderId: "749138955039",
  appId: "1:749138955039:web:65df6firebaseService.js6b890654a53237e2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };