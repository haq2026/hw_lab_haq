import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Config values copied from the Firebase console (Project settings > Your apps > ArbeitRN web app).
const firebaseConfig = {
  apiKey: 'AIzaSyBrZAJUHww5q_1n8qT8H8E9Rp917KbbFy4',
  authDomain: 'arbeit-ecace.firebaseapp.com',
  projectId: 'arbeit-ecace',
  storageBucket: 'arbeit-ecace.firebasestorage.app',
  messagingSenderId: '840989025899',
  appId: '1:840989025899:web:2483c7ba3f360ccfa9332e',
};

// Initialize the Firebase app once and export the Firestore handle the rest of the app uses.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
