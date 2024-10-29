import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZCRFIEBFn5DikUOzu7LmxTrItSgliAMY",
  authDomain: "login-29a91.firebaseapp.com",
  projectId: "login-29a91",
  storageBucket: "login-29a91.appspot.com",
  messagingSenderId: "1060561535912",
  appId: "1:1060561535912:web:a38d7495889bb54046939d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
