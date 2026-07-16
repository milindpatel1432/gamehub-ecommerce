import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// ==========================================
// Product Routes
// ==========================================

// Create a new product
router.post('/', createProduct);

// Get all active products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/:id', updateProduct);

// Soft delete a product by ID
router.delete('/:id', deleteProduct);

export default router;
