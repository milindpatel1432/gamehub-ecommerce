import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
} from '../validations/orderValidation.js';

const router = express.Router();

// Apply protect middleware to all order routes
router.use(protect);

router.post('/', createOrderValidator, createOrder);
router.get('/', getMyOrders);
router.get('/my-orders', getMyOrders);
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatusValidator, updateOrderStatus);

export default router;
