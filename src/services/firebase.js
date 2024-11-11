// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzZCvEujEQ8FBQcRrkTmiso3itp3H1mlw",
  authDomain: "sistema-lista-tarefas-c69e8.firebaseapp.com",
  projectId: "sistema-lista-tarefas-c69e8",
  storageBucket: "sistema-lista-tarefas-c69e8.firebasestorage.app",
  messagingSenderId: "438563667966",
  appId: "1:438563667966:web:2e3a0c40d156a9e7118aaf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
