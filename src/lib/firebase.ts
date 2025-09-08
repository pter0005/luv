
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "forever-yours-rbprw",
  appId: "1:152834179796:web:b4fa05440070aa77997141",
  storageBucket: "forever-yours-rbprw.firebasestorage.app",
  apiKey: "AIzaSyDwjaNVSNsdZBTBt2fhUYZoY3QP45y_jZA",
  authDomain: "forever-yours-rbprw.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "152834179796"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
