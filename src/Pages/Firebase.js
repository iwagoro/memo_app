import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyAWJIpC5sFmEVxgkx4luihHkP1p8tYjHaI",

    authDomain: "react-test-34de3.firebaseapp.com",

    projectId: "react-test-34de3",

    storageBucket: "react-test-34de3.appspot.com",

    messagingSenderId: "904744550048",

    appId: "1:904744550048:web:f04d703d0ea1e062e253c5",

    measurementId: "G-ZYTGY14N2E",
};

const app = initializeApp(firebaseConfig);

const BUCKET_NAME = "gs://react-test-34de3.appspot.com/";
const st = getStorage(app, BUCKET_NAME);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { st, db, auth, provider };
