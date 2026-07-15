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

const router = express.Router();

// Placeholder Authentication Protection Middleware
const protect = (req, res, next) => {
  // In a real environment, this extracts the bearer token, verifies JWT, and queries DB.
  // For the validation stage, we mock the session req.user.
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { id: 'mocked_authenticated_user_id' };
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized access. Authentication token required.',
    });
  }
};

// Authentication routes definition
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
