import express from 'express';
import { signup, login } from '../controllers/usersController.js';

const router = express.Router();

// POST /users/signup - Register a new user
router.post('/signup', signup);

// POST /users/login - Login an existing user
router.post('/login', login);

export default router;

