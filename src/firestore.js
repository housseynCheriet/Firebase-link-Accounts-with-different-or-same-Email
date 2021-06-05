// /src/firestore.js

import firebase from 'firebase'

//import 'firebase/firestore'

  
  var config = {//slectjs
    apiKey: "AIzaSyA10-Ms1P6-rrBz6s9XDyR6vxmeoCJzJUc",
    authDomain: "signin-with-any-email.firebaseapp.com",
    projectId: "signin-with-any-email",
    storageBucket: "signin-with-any-email.appspot.com",
    messagingSenderId: "922977137341",
    appId: "1:922977137341:web:4b05122143663f8b77bdd4",
    measurementId: "G-60FJ3FHNHW"
    
  };   

firebase.initializeApp(config);
//firebase.initializeApp(config2,"secondary");
   const db = firebase.firestore();



export {firebase,db};