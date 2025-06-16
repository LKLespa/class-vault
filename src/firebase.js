import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWyKZa-RlR0AYTDle9-imk51lmp3tcIFc",
  authDomain: "lespa-s-todos.firebaseapp.com",
  projectId: "lespa-s-todos",
  storageBucket: "lespa-s-todos.appspot.com",
  messagingSenderId: "128082750630",
  appId: "1:128082750630:web:95e651b59c3ac8afbed867",
  measurementId: "G-9K5NPCWYTD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }