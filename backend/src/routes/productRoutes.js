import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import {
  createProductValidator,
  updateProductValidator
} from '../validations/productValidation.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// Product Routes
// ==========================================

// Create a new product (Admin Only)
router.post('/', protect, authorize('admin'), createProductValidator, createProduct);

// Get all active products (Public)
router.get('/', getAllProducts);

// Get a single product by ID (Public)
router.get('/:id', getProductById);

// Update a product by ID (Admin Only)
router.put('/:id', protect, authorize('admin'), updateProductValidator, updateProduct);

// Soft delete a product by ID (Admin Only)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
