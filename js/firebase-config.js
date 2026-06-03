// Firebase Configuration - ProSoftwareTools
// Using Firebase v9 Compat mode (loaded via CDN in HTML)

const firebaseConfig = {
    apiKey: "AIzaSyDHaCPmKTpSh4I2W1ujpJ9eGUCwxjLqdfg",
    authDomain: "prosoftwaretools.firebaseapp.com",
    projectId: "prosoftwaretools",
    storageBucket: "prosoftwaretools.firebasestorage.app",
    messagingSenderId: "244672547274",
    appId: "1:244672547274:web:ae183cb2ad659c0c1d6733",
    measurementId: "G-3W6CNT4EJG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Auth
const auth = firebase.auth();
