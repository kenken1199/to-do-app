// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFUIaCMSG3ZGVPBw_62uRskBDczfTMDuA",
  authDomain: "ssssss-207ba.firebaseapp.com",
  databaseURL: "https://ssssss-207ba-default-rtdb.firebaseio.com",
  projectId: "ssssss-207ba",
  storageBucket: "ssssss-207ba.firebasestorage.app",
  messagingSenderId: "654120515085",
  appId: "1:654120515085:web:81c517195eb0b89815c744",
  measurementId: "G-FW1W5BBRX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
