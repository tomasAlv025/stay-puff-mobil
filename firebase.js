const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyDlan6WyVhA8Okw0Fof6vH0mmgOoECAHNU",
  authDomain: "staypuff-mobil-tomas.firebaseapp.com",
  projectId: "staypuff-mobil-tomas",
  storageBucket: "staypuff-mobil-tomas.appspot.com",
  messagingSenderId: "23328275505",
  appId: "1:23328275505:web:ab8b2bea2260330c4ca910",
  measurementId: "G-QX50H09PDY"
};

// Initialize Firebase solo si no se ha hecho previamente
const app = initializeApp(firebaseConfig);

//inicializar firestore y auth
const db = getFirestore(app);
const auth = getAuth(app);

//exportar instancias
module.exports = { db, auth };
