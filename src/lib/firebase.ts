
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWEwSl1ErMekOO8EwstbP6-xWBHO42__w",
  authDomain: "bot-nexa.firebaseapp.com",
  projectId: "bot-nexa",
  storageBucket: "bot-nexa.firebasestorage.app",
  messagingSenderId: "509965793741",
  appId: "1:509965793741:web:1663e461182f6523acec84",
  measurementId: "G-3SH5LQNX48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
