const firebaseConfig = {
  apiKey: "AIzaSyDlan6WyVhA8Okw0Fof6vH0mmgOoECAHNU",
  authDomain: "staypuff-mobil-tomas.firebaseapp.com",
  projectId: "staypuff-mobil-tomas",
  storageBucket: "staypuff-mobil.appspot.com",
  messagingSenderId: "23328275505",
  appId: "1:23328275505:web:ab8b2bea2260330c4ca910",
  measurementId: "G-QX50H09PDY"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const logoutButton = document.getElementById('logoutButton');

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => {
        // Eliminar datos del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert('Cierre de sesión exitoso');
        // Redirigir a la página de login
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  });
}
