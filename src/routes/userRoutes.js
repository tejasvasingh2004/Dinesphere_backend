// routes/userRoutes.js
import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import db from '../models/db.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  // only accessible if JWT valid
  const users = await db('users');
  res.json(users);
});

export default router;
