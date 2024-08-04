// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgaOvdsSf6kLjJ_USc5MJP88CqkwdcEbw",
  authDomain: "inventory-management-8f5e1.firebaseapp.com",
  projectId: "inventory-management-8f5e1",
  storageBucket: "inventory-management-8f5e1.appspot.com",
  messagingSenderId: "401321688928",
  appId: "1:401321688928:web:898c3082fd54e94e6be805",
  measurementId: "G-7PGBJ3L7L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.error('Analytics support check failed:', error);
  });
}

const firestore = getFirestore(app);

export { firestore };
