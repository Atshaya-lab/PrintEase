import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

// Enable Firebase services
const isAuthEnabled = isFirebaseConfigured;
const isFirestoreEnabled = isFirebaseConfigured;
const isStorageEnabled = isFirebaseConfigured;

// Initialize Firebase app
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// Firebase services
export const auth = (app && isAuthEnabled) ? getAuth(app) : null;
export const db = (app && isFirestoreEnabled) ? getFirestore(app) : null;
export const storage = (app && isStorageEnabled) ? getStorage(app) : null;

// Log Firebase status for debugging
console.log('[Firebase] Configured:', isFirebaseConfigured);
console.log('[Firebase] Auth:', !!auth, '| Firestore:', !!db, '| Storage:', !!storage);

// Export feature flags
export {
  isFirebaseConfigured,
  isAuthEnabled,
  isFirestoreEnabled,
  isStorageEnabled
};