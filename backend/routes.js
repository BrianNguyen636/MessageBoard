import express from 'express';
import pool from './database.js';



const router = express.Router();
router.use(express.json());


/**
 * Grabs the pool connection to the Azure SQL database
 */
try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database!');

    connection.release()
} catch (error) {
    console.error('Error connecting to MySQL:', error.message);
}


/**
 * @swagger
 * tags:
 *  name: Users
 * /users:
 *  get:
 *      summary: Get all users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of user objects
 *          500:
 *              description: Error
 *              
 */
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

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get a user by their ID
 *      parameters:
 *        - in: path
 *          name: id
 *          type: integer
 *          required: true
 *          description: The ID of the user
 *              
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The user objects
 *          404:
 *              description: User not found
 *          500:
 *              description: Error
 *              
 *
router.get('/users/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM Users where userID=' + req.params.id)
      if (rows.length > 0) {
        res.send(JSON.stringify(rows[0]))
      } else {
        res.status(404).send({error: "User not found"})
      }
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Attempt a login
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                      required:
 *                          - username
 *                          - password
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Successful login returns userID
 *          404:
 *              description: Failed login
 *              
 */
router.post('/login', async (req, res) => {
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

/**
 * @swagger
 * /users/{id}/posts:
 *  get:
 *      summary: Get all a Users' posts by their ID
 *      parameters:
 *        - in: path
 *          name: id
 *          type: integer
 *          required: true
 *          description: The ID of the user
 *              
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: All the posts by the user
 *          500:
 *              description: Error
 *              
 */
router.get('/users/:id/posts', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM Posts where userID=' + req.params.id)
      res.send(JSON.stringify(rows))
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});
/**
 * @swagger
 * /users:
 *  post:
 *      summary: Create a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                      required:
 *                          - username
 *                          - password
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Returns the userID of the newly created user
 *          404:
 *              description: Failed login
 *              
 */
router.post('/users', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const connection = await pool.getConnection();
        const rows = await connection.execute(`INSERT INTO Users (username, password) VALUES ( \"`+ username + `\",\"` + password + `\")`)
        res.status(200).send({userID: rows[0].insertId})
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});
/**
 * @swagger
 * /users/{id}:
 *  delete:
 *      summary: Deletes a user by their ID
 *      parameters:
 *        - in: path
 *          name: id
 *          type: integer
 *          required: true
 *          description: The ID of the user
 *              
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Success message
 *          500:
 *              description: Error
 *              
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.execute(`DELETE FROM Users where userID = ` + req.params.id)
        res.status(200).send({Success: "User " + req.params.id + " successfully deleted"})
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});



//get all threads
router.get('/threads', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const rows = await connection.execute('SELECT * FROM Threads')
      res.send(JSON.stringify(rows[0]))
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});

  //get a thread by id
  router.get('/threads/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const rows = await connection.execute('SELECT * FROM Threads where threadID = ' + req.params.id)
      res.send(JSON.stringify(rows[0]))
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});

  //get all posts from a thread
  router.get('/threads/:id/posts', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const rows = await connection.execute('SELECT * FROM Posts where threadID = ' + req.params.id + " ORDER BY time asc")
      res.send(JSON.stringify(rows[0]))
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});

//MAKE A THREAD with TITLE, userID, text
router.post('/threads', async (req, res) => {
    try {
        const body = req.body
        const title = body.title
        const userID = body.userID
        const text = body.body
        const connection = await pool.getConnection();

        const threadRows = await connection.execute(`INSERT INTO Threads (title) VALUES (${title})`)
        const threadID = threadRows[0].insertId

        const queryString = `INSERT INTO Posts (threadID, userID, body) VALUES 
            ('${threadID}', '${userID}','${text}')`
        const rows = await connection.execute(queryString);
        res.header({threadID: threadID})
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});

//Delete a thread by ID
router.delete('/threads/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.execute(`DELETE FROM Posts WHERE threadID = ${req.params.id}`)
        const queryString = `DELETE FROM Threads WHERE threadID = ${req.params.id}`
        const rows = await connection.execute(queryString);
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});


  //get all posts
router.get('/posts', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const rows = await connection.execute('SELECT * FROM Posts')
      res.send(JSON.stringify(rows[0]))
      connection.release();
    } catch (err) {
      res.status(500).json({ error: err?.message });
    }
});

//Get post by id
router.get('/posts/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = connection.execute('SELECT * FROM Posts WHERE postID = ' + req.params.id);
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});

//Get all posts that have replied to the ID'd post
router.get('/posts/reply/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = connection.execute('SELECT * FROM Posts WHERE replyID = ' + req.params.id);
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});
//MAKE A POST with userID, replyID, threadID, and body.
router.post('/posts', async (req, res) => {
    try {
        const body = req.body
        const userID = body.userID
        const replyID = body.replyID
        const text = body.body
        const threadID = body.threadID
        const connection = await pool.getConnection();
        const queryString = `INSERT INTO Posts (threadID, userID, replyID, body) VALUES 
            ('${threadID}', '${userID}','${replyID}','${text}')`
        const rows = await connection.execute(queryString);
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});

//Delete a post by ID
router.delete('/posts/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const queryString = `DELETE FROM Posts WHERE postID = ${req.params.id}`
        const rows = await connection.execute(queryString);
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});

router.get('/example', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.execute('');
        res.send(JSON.stringify(rows[0]))
        connection.release();
    } catch (err) {
        res.status(500).json({ error: err?.message });
    }
});


export default router;