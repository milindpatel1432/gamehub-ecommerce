import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator
} from '../validations/authValidation.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ===============================
// Authentication Routes
// ===============================
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;