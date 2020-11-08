import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyBzkTJxEz9tYfmNw_Uv2WlfavfDBeX0rKI",
    authDomain: "wili-65810.firebaseapp.com",
    databaseURL: "https://wili-65810.firebaseio.com",
    projectId: "wili-65810",
    storageBucket: "wili-65810.appspot.com",
    messagingSenderId: "76833083373",
    appId: "1:76833083373:web:2b6cf660aa4d2b9461e1e4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();