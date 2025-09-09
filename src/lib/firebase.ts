
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// =========================================================================
// ATENÇÃO: SUBSTITUA OS VALORES ABAIXO PELAS SUAS CHAVES DO FIREBASE
// =========================================================================
// Para o app funcionar, você precisa criar um projeto no Firebase
// e substituir os valores de exemplo abaixo pelas suas próprias chaves.
// Você pode encontrar essas chaves no console do Firebase, nas
// configurações do seu projeto na web.
// =========================================================================
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:your-sender-id:web:your-app-id"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
