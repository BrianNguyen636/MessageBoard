import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Gets the environment data from the .env file.
dotenv.config();


/**
 * MySQL connection from Azure
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    ssl: { rejectUnauthorized: true } // Required for Azure MySQL
});

export default pool;