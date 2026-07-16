import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getStats,
  getGames,
  addGame,
  updateGame,
  deleteGame,
  getConsoles,
  addConsole,
  updateConsole,
  deleteConsole,
  getOrders,
  getRentals,
  getUsers,
  toggleBlockUser,
  deleteUser,
  getAnalytics
} from '../controllers/adminController.js';
import {
  createProductValidator,
  updateProductValidator
} from '../validations/productValidation.js';

const router = express.Router();

// Apply protect & authorize('admin') to all admin endpoints
router.use(protect);
router.use(authorize('admin'));

// Stats & Analytics
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);

// Games Catalog Management
router.get('/games', getGames);
router.post('/games', createProductValidator, addGame);
router.put('/games/:id', updateProductValidator, updateGame);
router.delete('/games/:id', deleteGame);

// Consoles Catalog Management
router.get('/consoles', getConsoles);
router.post('/consoles', createProductValidator, addConsole);
router.put('/consoles/:id', updateProductValidator, updateConsole);
router.delete('/consoles/:id', deleteConsole);

// Order & Rental management
router.get('/orders', getOrders);
router.get('/rentals', getRentals);

// User Accounts management
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

export default router;
