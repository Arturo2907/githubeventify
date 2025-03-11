async function manejarAutenticacion(tipo) {
    if (tipo === 'register') {
        const nombre = document.getElementById('register-nombre').value.trim();
        const correo = document.getElementById('register-correo').value.trim();
        const telefono = document.getElementById('register-telefono').value.trim();
        const contrasena = document.getElementById('register-contrasena').value.trim();

        // Validar que los campos no estén vacíos
        if (!nombre || !correo || !telefono || !contrasena) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/crear-cuenta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, correo, telefono, contrasena }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Cuenta creada exitosamente');
                cerrarModal(); // Cierra el modal después de crear la cuenta
            } else {
                alert('Error al crear la cuenta: ' + (result.error || ''));
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
            alert('Error al crear la cuenta.');
        }
    } else if (tipo === 'login') {
        const correo = document.getElementById('login-correo').value.trim();
        const contrasena = document.getElementById('login-contrasena').value.trim();

        // Validar que los campos no estén vacíos
        if (!correo || !contrasena) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/consultar-acceso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario: correo, contraseña: contrasena }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Acceso concedido');
                // Espera 1 segundo antes de cerrar el modal para que el usuario vea el mensaje
                setTimeout(() => {
                    cerrarModal(); // Cierra el modal
                }, 1000);
            } else {
                alert('Error al iniciar sesión: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión.');
        }
    }
}