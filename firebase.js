// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvuT2u-qij1h9yOYrXWWkr1gaX7RWerZ4",
  authDomain: "pantry-app-ba309.firebaseapp.com",
  projectId: "pantry-app-ba309",
  storageBucket: "pantry-app-ba309.appspot.com",
  messagingSenderId: "321465975615",
  appId: "1:321465975615:web:bc1c3957d51af785c2498a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {firestore}