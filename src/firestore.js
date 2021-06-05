// /src/firestore.js

import firebase from 'firebase'

//import 'firebase/firestore'

  
  var config = {//slectjs
    apiKey: "AIzaSyD2WpYdvFpDgtjPVNZhKWMgpR03YMMVkBg",
    authDomain: "signin-with-same-email.firebaseapp.com",
    projectId: "signin-with-same-email",
    storageBucket: "signin-with-same-email.appspot.com",
    messagingSenderId: "564634343847",
    appId: "1:564634343847:web:04ee43723078b28108be82",
    measurementId: "G-S1T87ZWC8W"
    
  };   

firebase.initializeApp(config);
//firebase.initializeApp(config2,"secondary");
   const db = firebase.firestore();



export {firebase,db};