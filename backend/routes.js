import express from 'express';
import pool from './database.js';

const router = express.Router();
router.use(express.json());

try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database!');
    connection.release()
} catch (error) {
    console.error('Error connecting to MySQL:', error.message);
}

router.get('/Users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = connection.execute('SELECT * FROM Users')
    console.log(JSON.stringify(rows))
    res.json(JSON.stringify(rows))
    connection.release();
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

export default router;