import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { addToCartValidator, updateCartItemValidator } from '../validations/cartValidation.js';

const router = express.Router();

// All cart routes must be protected
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCartValidator, addToCart);
router.put('/update/:id', updateCartItemValidator, updateCartItem);
router.delete('/remove/:id', removeCartItem);
router.post('/clear', clearCart);

export default router;
