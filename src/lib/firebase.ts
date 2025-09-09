
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA41c7j6S5Y-yVIiC-dI0xUnzAnY4A23S4",
  authDomain: "luv-419015.firebaseapp.com",
  projectId: "luv-419015",
  storageBucket: "luv-419015.appspot.com",
  messagingSenderId: "339396349926",
  appId: "1:339396349926:web:6e3a6428459b6b7c53931b",
  measurementId: "G-GZ3J1K3FPE"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
