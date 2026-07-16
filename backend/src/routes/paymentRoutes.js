import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPaymentOrderValidator,
  verifyPaymentValidator,
} from '../validations/paymentValidation.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.post('/create-order', createPaymentOrderValidator, createPaymentOrder);
router.post('/verify', verifyPaymentValidator, verifyPayment);

export default router;
