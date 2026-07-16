import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js';
import {
  createReviewValidator,
  updateReviewValidator,
  idParamValidator,
} from '../validations/reviewValidation.js';

const router = express.Router();

// Public route to view a product's reviews
router.get('/product/:productId', getProductReviews);

// Protected routes (Requires login)
router.post('/', protect, createReviewValidator, createReview);
router.put('/:id', protect, updateReviewValidator, updateReview);
router.delete('/:id', protect, idParamValidator, deleteReview);

// Admin Only routes
router.get('/', protect, authorize('admin'), getAllReviews);

export default router;
