import { initializeApp, auth } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp ({
    apiKey: "<your API key from firebase>",
    authDomain: "<your authDomain from firebase>",
    projectId: "<your project ID from firebase>",
    storageBucket: "<your storage bucket from firebase>",
    messagingSenderId: "<your messaging sender ID from firebase>",
    appId: "<your app ID from firebase>",
    measurementId: "<your measurement ID from firebase>"
});

export const db = getFirestore();

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);
