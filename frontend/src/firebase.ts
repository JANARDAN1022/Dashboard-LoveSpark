import {initializeApp} from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDDtSU0ncz3KFvGmRhmJMBEo0rHU8ooz7s",
  authDomain: "lovespark-c8351.firebaseapp.com",
  projectId: "lovespark-c8351",
  storageBucket: "lovespark-c8351.appspot.com",
  messagingSenderId: "602821315846",
  appId: "1:602821315846:web:60208b1e86f73adf336287",
  measurementId: "G-VJQ1E5D2K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const storage = getStorage(app);
//console.log(analytics);