import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../validations/categoryValidation.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// Category Routes
// ==========================================

// Create a new category (Admin Only)
router.post('/', protect, authorize('admin'), createCategoryValidator, createCategory);

// Get all categories (Public / Admin)
router.get('/', getAllCategories);

// Get single category by ID (Public)
router.get('/:id', getCategoryById);

// Update category by ID (Admin Only)
router.put('/:id', protect, authorize('admin'), updateCategoryValidator, updateCategory);

// Delete category by ID (Admin Only)
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
