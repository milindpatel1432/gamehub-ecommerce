import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  addToWishlistValidator,
  wishlistIdParamValidator,
} from '../validations/wishlistValidation.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get('/', getWishlist);
router.post('/add', addToWishlistValidator, addToWishlist);
router.delete('/remove/:id', wishlistIdParamValidator, removeFromWishlist);
router.post('/move-to-cart/:id', wishlistIdParamValidator, moveToCart);

export default router;
