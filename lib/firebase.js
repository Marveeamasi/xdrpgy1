import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBoNkY8JdKZkfg0FOh30-p8fEHWZQq38u8",
  authDomain: "mada-ce342.firebaseapp.com",
  projectId: "mada-ce342",
  storageBucket: "mada-ce342.firebasestorage.app",
  messagingSenderId: "632616812557",
  appId: "1:632616812557:web:b3896c51452f6f14a75544"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, get, child };
