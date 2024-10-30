const bcrypt = require('bcryptjs');

const password = 'tomas123'; // Reemplaza con la contraseña que desees
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(hashedPassword); // Utiliza esta contraseña encriptada para Firestore
