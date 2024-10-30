const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const bodyParser = require('body-parser');
const { db } = require('./firebase');
const { collection, getDocs, addDoc, query, where } = require('firebase/firestore');
const app = express();
const port = 3000; // Puerto donde escuchará la API

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para parsear JSON
app.use(express.json());

// Clave secreta para JWT
const SECRET_KEY = 'mysecretkey';

// Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }
  const user = querySnapshot.docs[0].data();
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login exitoso', token });
});

// Ruta protegida que requiere autenticación
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.json({ message: 'Acceso permitido', userId: decoded.id });
  });
});

// Ruta para manejar la apertura de caja
app.post('/apertura_caja', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    const { montoInicial } = req.body;
    await addDoc(collection(db, "aperturas"), {
      userId: decoded.id,
      montoInicial,
      timestamp: new Date()
    });
    res.json({ message: 'Apertura de caja exitosa', userId: decoded.id });
  });
});

// Ruta para manejar el cierre de caja
app.post('/cierre_caja', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    const { ingresos, egresos, montoFinal } = req.body;
    await addDoc(collection(db, "cierres"), {
      userId: decoded.id,
      ingresos,
      egresos,
      montoFinal,
      timestamp: new Date()
    });
    res.json({ message: 'Cierre de caja exitoso', userId: decoded.id });
  });
});

// Ruta para imprimir detalles de ventas
app.get('/imprimir_detalles', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    // Simulación de los detalles de ventas
    const detallesDeVentas = [
      { producto: 'Producto 1', cantidad: 2, total: 20 },
      { producto: 'Producto 2', cantidad: 1, total: 10 }
    ];
    res.json({ message: 'Detalles de ventas impresos', ventas: detallesDeVentas });
  });
});

// Ruta para manejar el cierre de sesión
app.post('/logout', (req, res) => {
  res.json({ message: 'Cierre de sesión exitoso' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});