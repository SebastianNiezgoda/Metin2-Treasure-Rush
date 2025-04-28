// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Konfiguracja projektu Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyBRuVYG0hsaldjGQcq5JBSFNP8McmqA6vA",
  authDomain: "metin2-cc447.firebaseapp.com",
  projectId: "metin2-cc447",
  storageBucket: "metin2-cc447.firebasestorage.app",
  messagingSenderId: "217543613975",
  appId: "1:217543613975:web:b89d2a6614c1b41c7f8652",
  measurementId: "G-5TKR341EDZ"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Opcjonalnie: Provider do logowania Google
export const googleProvider = new GoogleAuthProvider();
