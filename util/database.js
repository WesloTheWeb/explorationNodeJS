require('dotenv').config();
const mysql = require('mysql2');

// creation of a pool to handle many queries.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: process.env.DB_PASSWORD
});

module.exports = pool.promise();