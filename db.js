const { Pool } = require('pg');

// Configura las credenciales de tu base de datos
const pool = new Pool({
  user: 'Admin',         // Reemplaza con tu usuario de PostgreSQL
  host: 'localhost',          // O la dirección de tu servidor de BD
  database: 'Eventify',      // Nombre de tu base de datos
  password: '123456',  // Tu contraseña
  port: 5432,                 // Puerto por defecto de PostgreSQL
});

module.exports = pool;