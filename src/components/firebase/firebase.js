import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBhzljoCsf0dFsjUOcMtO-AX6jj1KY6MNk",
    authDomain: "succ-3d591.firebaseapp.com",
    databaseURL: "https://succ-3d591.firebaseio.com",
    projectId: "succ-3d591",
    storageBucket: "succ-3d591.appspot.com",
    messagingSenderId: "654195978157",
    appId: "1:654195978157:web:d4f8c01b9717a441defb24",
    measurementId: "G-262SH4RNDZ",
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();
export const storage = firebase.storage();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};
