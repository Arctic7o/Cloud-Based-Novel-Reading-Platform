import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyB4K6dsOQDpCDhjGKccsGd6nrExyZ9j_SA",
  authDomain: "cloud-novel-platform.firebaseapp.com",
  projectId: "cloud-novel-platform",
  storageBucket: "cloud-novel-platform.firebasestorage.app",
  messagingSenderId: "143824263130",
  appId: "1:143824263130:web:df592c73f3be5ba61512e3"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);