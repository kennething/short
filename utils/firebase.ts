import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpo-iR1gJwg4mFU7tHFjAtZw-rWeox6u4",
  authDomain: "url-shortener-a23a2.firebaseapp.com",
  projectId: "url-shortener-a23a2",
  storageBucket: "url-shortener-a23a2.firebasestorage.app",
  messagingSenderId: "839485031609",
  appId: "1:839485031609:web:657bd1dc31c7eacccb8768",
  measurementId: "G-G2YFQBNS5H",
} as const;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
