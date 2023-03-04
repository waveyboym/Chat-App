import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseApp = initializeApp ({
    apiKey: "<Your own key>",
    authDomain: "<Your own key>",
    projectId: "<Your own key>",
    storageBucket: "<Your own key>",
    messagingSenderId: "<Your own key>",
    appId: "<Your own key>",
    measurementId: "<Your own key>"
});

export const db = getFirestore();

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);
