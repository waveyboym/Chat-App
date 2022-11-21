import { initializeApp, auth } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp ({
    apiKey: "AIzaSyA5QPoMXkpbWf9cr-9IXPw-XuHuz_g3j5Q",
    authDomain: "chat-app-project-4b80f.firebaseapp.com",
    projectId: "chat-app-project-4b80f",
    storageBucket: "chat-app-project-4b80f.appspot.com",
    messagingSenderId: "9646833396",
    appId: "1:9646833396:web:be42f16546e613b20968a1",
    measurementId: "G-XZ4SCXF5JY"
});

export const db = getFirestore();

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);