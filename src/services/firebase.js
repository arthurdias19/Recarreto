import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBXkuI--rcz94F3IUIBMkIo65V6UXO6SKs",
    authDomain: "recarreto-c66e8.firebaseapp.com",
    projectId: "recarreto-c66e8",
    storageBucket: "recarreto-c66e8.firebasestorage.app",
    messagingSenderId: "465150290158",
    appId: "1:465150290158:web:d3f87694596429160cebff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);