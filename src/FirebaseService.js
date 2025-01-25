import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, linkWithPopup, linkWithCredential, updatePassword, reauthenticateWithCredential, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAel9fAv5HghHyyWC1tnxOoAF9_wwNvbQQ",
    authDomain: "jobify-39bef.firebaseapp.com",
    projectId: "jobify-39bef",
    storageBucket: "jobify-39bef.firebasestorage.app",
    messagingSenderId: "1002423731996",
    appId: "1:1002423731996:web:f7133bc60de5f83f121cd9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, sendPasswordResetEmail, updatePassword, linkWithPopup, linkWithCredential, EmailAuthProvider, signOut, reauthenticateWithCredential, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged }
