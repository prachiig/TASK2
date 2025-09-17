import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace this with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD6yzmnm9YcndhdedEjbVzMkZj9AoAO2h8",
  authDomain: "ocr-cvit.firebaseapp.com",
  projectId: "ocr-cvit",
  storageBucket: "ocr-cvit.firebasestorage.app",
  messagingSenderId: "774122605309",
  appId: "1:774122605309:web:8e6198e9b330bfeb680c94",
  measurementId: "G-K6WQFBF4LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
