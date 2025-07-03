// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// console.log("Firebase Config:", firebaseConfig);
// if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
//   throw new Error("Missing Firebase configuration. Check your .env file.");
// }
// console.log("API KEY:", firebaseConfig.apiKey);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
