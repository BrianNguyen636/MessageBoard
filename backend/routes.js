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

//Make the user table
router.post('/maketable/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.execute('DROP TABLE IF EXISTS Users;')
        const rows = await connection.execute('CREATE TABLE Users(userID int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255) NOT NULL,password varchar(255) NOT NULL)')
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});


//get all users
router.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.execute('SELECT * FROM Users')
    res.send(JSON.stringify(rows[0]))
    connection.release();
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});
//get user by their id
router.get('/users/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM Users where userID=' + req.params.id)
      res.send(JSON.stringify(rows[0]))
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});
//Login to a user account with username and password
router.get('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const connection = await pool.getConnection();
        const rows = await connection.execute('SELECT userID FROM Users where username = \"' + username +
        '\" and password =\"' + password + '\"')
        if (rows[0].length == 0) {
            res.status(404).json({ error: 'Login failed' });
        } else {
            res.status(200).json(rows[0][0])
        }
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});

//CREATE USER FROM BODY
router.post('/users', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const connection = await pool.getConnection();
        const rows = await connection.execute(`INSERT INTO Users (username, password) VALUES ( \"`+ username + `\",\"` + password + `\")`)
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});
//DELETE USER BY ID
router.delete('/users/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.execute(`DELETE FROM Users where userID = ` + req.params.id)
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});



router.get('/example', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = awaitconnection.execute('')
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});


export default router;