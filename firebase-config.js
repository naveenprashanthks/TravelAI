import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWByEcDufnxT4Ptwe-m4I3ZU6e9-stkrg",
  authDomain: "travel-booking-bbc0a.firebaseapp.com",
  projectId: "travel-booking-bbc0a",
  storageBucket: "travel-booking-bbc0a.appspot.com",
  messagingSenderId: "442018319275",
  appId: "1:442018319275:web:2d691ad63609d07bc3e0ee",
  measurementId: "G-VYMYB0PDP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
