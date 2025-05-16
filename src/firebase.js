import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1_a4uqYcsXC2EQ5FV3r7L6M8Nvj6S23E",
  authDomain: "classvault-1a735.firebaseapp.com",
  projectId: "classvault-1a735",
  storageBucket: "classvault-1a735.firebasestorage.app",
  messagingSenderId: "66959093357",
  appId: "1:66959093357:web:b32c02c431af048990d964",
  measurementId: "G-PSFBV0HFWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }