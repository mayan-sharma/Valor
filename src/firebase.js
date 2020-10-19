import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/analytics";

var firebaseConfig = {
  apiKey: "AIzaSyAkv1H-MKaSgVo0tjDfLGXJwubh7ynNaWA",
  authDomain: "valor-bca2b.firebaseapp.com",
  databaseURL: "https://valor-bca2b.firebaseio.com",
  projectId: "valor-bca2b",
  storageBucket: "valor-bca2b.appspot.com",
  messagingSenderId: "367981150758",
  appId: "1:367981150758:web:015f0df0def5f34a5c9ce7",
  measurementId: "G-5F9WQFE7MS",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
