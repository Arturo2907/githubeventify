const express = require('express');
const pool = require('./db.js'); // Import the database connection
const cors = require('cors'); // Ensure cors is installed and imported
const app = express();
const port = 3000;

// Enable CORS for all origins (for development)
app.use(cors());

// Middleware to parse JSON (if sending data from the frontend)
app.use(express.json());

// Ruta de prueba para verificar la conexión a la BD (opcional, puedes mantenerla o eliminarla)
app.get('/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()'); // Consulta simple
        res.json({ success: true, time: result.rows[0].now });
        client.release();
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ success: false, error: 'Error de conexión' });
    }
});

// Ruta para obtener empleados (GET, opcional, puedes mantenerla o eliminarla)
app.get('/usuario', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario');
        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Error al consultar usuario' });
    }
});

// Nueva ruta para consultar acceso usando nombre y contraseña (POST)
app.post('/consultar-acceso', async (req, res) => {
    const { usuario, contraseña } = req.body;
    try {
        const query = 'SELECT * FROM usuario WHERE usuario = $1 AND contrasena = $2';
        const result = await pool.query(query, [usuario, contraseña]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Acceso concedido' });
        } else {
            res.json({ success: false, message: 'Acceso denegado. Nombre o contraseña incorrectos.' });
        }
    } catch (err) {
        console.error('Error al consultar acceso:', err.message, err.stack);
        res.status(500).json({ success: false, error: 'Error al consultar acceso: ' + err.message });
    }
});

// Ruta para crear un nuevo usuario (POST)
app.post('/crear-cuenta', async (req, res) => {
    const { nombre, correo, telefono, contrasena } = req.body;
    if (!nombre || !correo || !telefono || !contrasena) {
        return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios.' });
    }

    try {
        const query = 'INSERT INTO usuario (usuario, correo, telefono, contrasena) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [nombre, correo, telefono, contrasena]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Cuenta creada exitosamente', usuario: result.rows[0] });
        } else {
            res.status(500).json({ success: false, error: 'Error al crear la cuenta' });
        }
    } catch (err) {
        console.error('Error al crear la cuenta:', err.message, err.stack);
        res.status(500).json({ success: false, error: 'Error al crear la cuenta: ' + err.message });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});