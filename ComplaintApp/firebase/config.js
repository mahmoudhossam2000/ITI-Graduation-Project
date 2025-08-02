import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2ivWkQcWZl45E-xopsORHGn9LZfN9lI4",
  authDomain: "complaint-system-mobile.firebaseapp.com",
  projectId: "complaint-system-mobile",
  storageBucket: "complaint-system-mobile.appspot.com",
  messagingSenderId: "1092210607299",
  appId: "1:1092210607299:web:cf544d713145f2e35ace76",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();