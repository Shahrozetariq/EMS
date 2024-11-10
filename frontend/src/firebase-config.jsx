// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpzBzH8svajyUp9OPSf8GKcMGQ5saSPuA",
  authDomain: "ems-delta.firebaseapp.com",
  projectId: "ems-delta",
  storageBucket: "ems-delta.firebasestorage.app",
  messagingSenderId: "225893005870",
  appId: "1:225893005870:web:8fbbb84e6b06e778f9fdbf",
  measurementId: "G-2V7GKPN0HK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Firebase authentication instance
const analytics = getAnalytics(app);

export { auth, signInWithEmailAndPassword };
