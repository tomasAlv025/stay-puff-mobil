//parte del frontend:
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const aperturaCajaForm = document.getElementById('aperturaCajaForm');
    const cierreCajaForm = document.getElementById('cierreCajaForm');
    const registerForm = document.getElementById('registerForm');
    const message = document.getElementById('message');
    const logoutButton = document.getElementById('logoutButton'); // Botón de cerrar sesión

    // Manejador para el formulario de login
    if (loginForm) { // Solo si estamos en la página de login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', username); // Guardar el nombre de usuario
                    window.location.href = 'menu.html';
                } else {
                    message.textContent = data.message;
                }
            } catch (error) {
                message.textContent = 'Error en la conexión. Inténtalo de nuevo más tarde.';
            }
        });
    }

    // Manejador para el formulario de registro
    if (registerForm) { // Solo si estamos en la página de registro
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('passwordReg').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password === confirmPassword) {
                try {
                    //const hashedPassword = bcrypt.hashSync(password, 10); // eliminamos el Encriptar contraseña
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ firstName, lastName, email, username: firstName, password: hashedPassword }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        alert(`¡Registro exitoso de ${firstName} ${lastName} con correo: ${email}!`);
                        window.location.href = 'login.html'; // Redirigir a la página de login después del registro
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    alert('Error en la conexión. Inténtalo de nuevo más tarde.');
                }
            } else {
                alert('Las contraseñas no coinciden. Inténtalo de nuevo.');
            }
        });
    }

    // Manejador para el formulario de apertura de caja
    if (aperturaCajaForm) {
        const username = localStorage.getItem('username'); // Obtener el nombre de usuario
        document.getElementById('username').textContent = username;
        aperturaCajaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const montoInicial = document.getElementById('montoInicial').value;
            try {
                const response = await fetch('/apertura_caja', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({ montoInicial }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Apertura de caja exitosa');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Error en la conexión. Inténtalo de nuevo más tarde.');
            }
        });
    }

    // Manejador para el formulario de cierre de caja
    if (cierreCajaForm) {
        const username = localStorage.getItem('username');
        document.getElementById('username').textContent = username;
        document.getElementById('empleado').value = username;
        cierreCajaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const ingresos = 1000;  // Placeholder para ingresos, ajusta según tus datos
            const egresos = 200;    // Placeholder para egresos, ajusta según tus datos
            const montoFinal = ingresos - egresos;  // Calcula el monto final
            try {
                const response = await fetch('/cierre_caja', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({ ingresos, egresos, montoFinal }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Cierre de caja exitoso');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Error en la conexión. Inténtalo de nuevo más tarde.');
            }
        });

        // Manejador para imprimir detalles de venta
        document.getElementById('imprimirDetalles').addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/imprimir_detalles', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Detalles de venta:', data);
                    alert('Detalles de venta impresos');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Error en la conexión. Inténtalo de nuevo más tarde.');
            }
        });
    }

    // Manejador para el botón de cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            console.log('Logout button clicked'); // Confirmación del evento

            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.href = 'index.html';
                } else {
                    console.error('Error al cerrar sesión:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la conexión:', error);
            }
        });
    }
});
