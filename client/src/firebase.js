// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const env = await import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE,
  authDomain: "retail-mate.firebaseapp.com",
  projectId: "retail-mate",
  storageBucket: "retail-mate.appspot.com",
  messagingSenderId: "221745556054",
  appId: "1:221745556054:web:ea48d117660b6bc06b69f7",
  measurementId: "G-XJ30YH7ENV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);