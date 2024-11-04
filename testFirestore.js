console.log('Iniciando prueba de conexión a Firestore...');

const { db } = require('./firebase');
console.log('Instancia de Firestore:', db); // Agrega esta línea para verificar la instancia

const { collection, getDocs } = require('firebase/firestore');

async function testFirestoreConnection() {
    try {
        const snapshot = await getDocs(collection(db, 'users'));
        console.log('Conexión a Firestore exitosa');
    } catch (error) {
        console.error('Error al conectar con Firestore:', error);
    }
}

testFirestoreConnection();
