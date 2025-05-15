// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzQWzmYqnEl3fdK2M2V3-f52GEiDgo2k8",
  authDomain: "control-inventario-como.firebaseapp.com",
  projectId: "control-inventario-como",
  storageBucket: "control-inventario-como.firebasestorage.app",
  messagingSenderId: "428233783124",
  appId: "1:428233783124:web:fed3d0712d12cac42d3ac1",
  measurementId: "G-CS2S22YZC7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
