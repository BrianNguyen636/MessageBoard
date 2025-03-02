import express from 'express';
import { 
  passwordConfig as SQLAuthentication, 
  noPasswordConfig as PasswordlessConfig 
} from './config.js';
import { createDatabaseConnection } from './database.js';

const router = express.Router();
router.use(express.json());

const database = await createDatabaseConnection(SQLAuthentication);

router.get('/', async (req, res) => {
  try {
    // Return a list of users

    const users = await database.readAll();
    console.log(`users: ${JSON.stringify(users)}`);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

export default router;