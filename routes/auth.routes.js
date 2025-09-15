import express from 'express';
import { registerUser, loginUser, logOutUser, listUsers, addUserByEmail } from '../controllers/auth.controller.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logOutUser);

// list/search users (requires auth)
router.get('/users', authMiddleware, listUsers);

// add user by email (requires auth)
router.post('/add-user', authMiddleware, addUserByEmail);

export default router;