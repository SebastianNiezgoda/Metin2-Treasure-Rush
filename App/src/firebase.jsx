// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Konfiguracja projektu Firebase (placeholder – wstawić własne config z Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSy...ABC",
  authDomain: "metin2-treasure.firebaseapp.com",
  projectId: "metin2-treasure",
  storageBucket: "metin2-treasure.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-XYZ123ABC"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Opcjonalnie: Provider do logowania Google
export const googleProvider = new GoogleAuthProvider();
