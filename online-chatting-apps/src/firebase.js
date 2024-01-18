// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKK16TWPOtGyVUyr2Fo-ddZRKLHePQ1d8",
  authDomain: "chatapp-762a4.firebaseapp.com",
  projectId: "chatapp-762a4",
  storageBucket: "chatapp-762a4.appspot.com",
  messagingSenderId: "415504200715",
  appId: "1:415504200715:web:2fcb453479d47b3dc2430e",
  measurementId: "G-FE5X2Q9S0K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {auth, app}