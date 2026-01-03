import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyXx5kT5zhTBWTDKv-py8IXconRwyoPjw",
  authDomain: "civic-issue-tracker-11729.firebaseapp.com",
  projectId: "civic-issue-tracker-11729",
  storageBucket: "civic-issue-tracker-11729.firebasestorage.app",
  messagingSenderId: "199579456104",
  appId: "1:199579456104:web:eb77b9178a04352f0f61dd",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
