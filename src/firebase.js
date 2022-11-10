const firebaseConfig = {
    apiKey: "AIzaSyCd9xWamQmzDXv_hjdaKuaosrX-UywWZVc",
    authDomain: "omni-focus-9ca27.firebaseapp.com",
    databaseURL: "https://omni-focus-9ca27-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "omni-focus-9ca27",
    storageBucket: "omni-focus-9ca27.appspot.com",
    messagingSenderId: "308899448240",
    appId: "1:308899448240:web:18a6cc13bcc325a0544275",
    measurementId: "G-F7METZXDYJ"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();