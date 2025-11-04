import express from 'express';
import {
  checkEmail,
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  logoutUser, // <-- 1. IMPORT LOGOUT
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);

router.put('/profile', authMiddleware, updateUserProfile);

// --- 2. ADD LOGOUT ROUTE ---
router.post('/logout', logoutUser);

export default router;