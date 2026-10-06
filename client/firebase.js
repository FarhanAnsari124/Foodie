import { initializeApp } from "firebase/app";
import {getAuth  } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "foodie-ca151.firebaseapp.com",
  projectId: "foodie-ca151",
  storageBucket: "foodie-ca151.firebasestorage.app",
  messagingSenderId: "696459496583",
  appId: "1:696459496583:web:8ef84e791feb6afeca3c22"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

export {app,auth}