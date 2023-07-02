import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseApp = initializeApp ({
    apiKey: "<Your own key here>",
    authDomain: "<Your own key here>",
    projectId: "<Your own key here>",
    storageBucket: "<Your own key here>",
    messagingSenderId: "<Your own key here>",
    appId: "<Your own key here>",
    measurementId: "<Your own key here>"
});

export const db = getFirestore();

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);
