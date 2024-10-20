// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZCRFIEBFn5DikUOzu7LmxTrItSgliAMY",
  authDomain: "login-29a91.firebaseapp.com",
  projectId: "login-29a91",
  storageBucket: "login-29a91.appspot.com",
  messagingSenderId: "1060561535912",
  appId: "1:1060561535912:web:a38d7495889bb54046939d"
};

// Initialize Firebase
export const appFirabase = initializeApp(firebaseConfig);
export default appFirabase;