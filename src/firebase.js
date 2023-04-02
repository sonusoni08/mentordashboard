import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-ybCTPSlL0SUE94aag5BtpNHxNPjJNWo",
  authDomain: "dashboard-87868.firebaseapp.com",
  projectId: "dashboard-87868",
  storageBucket: "dashboard-87868.appspot.com",
  messagingSenderId: "598895490035",
  appId: "1:598895490035:web:e0c7ec64d7607e1d559886",
  measurementId: "G-3ML80NQB37"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);