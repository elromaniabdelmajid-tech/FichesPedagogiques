import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-YvOa3yj0HqATEzRUZ9TZM5Hksfg8Bew",
  authDomain: "fichespedagogiques-1c613.firebaseapp.com",
  projectId: "fichespedagogiques-1c613",
  storageBucket: "fichespedagogiques-1c613.firebasestorage.app",
  messagingSenderId: "324679108540",
  appId: "1:324679108540:web:67d0c0c9ea968b1f95cdb9",
  measurementId: "G-CSRN1CX16B" // (optionnel)
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);