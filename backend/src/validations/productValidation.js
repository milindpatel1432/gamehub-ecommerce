import { body } from 'express-validator';
import { validateResult } from './authValidation.js';

// ==========================================
// Product Create Validator
// ==========================================
export const createProductValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product title must be between 2 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of strings'),
  body('platform')
    .optional()
    .isArray()
    .withMessage('Platform must be an array of strings'),
  body('condition')
    .optional()
    .isIn(['New', 'Used'])
    .withMessage('Condition must be New or Used'),
  body('rentalAvailable')
    .optional()
    .isBoolean()
    .withMessage('rentalAvailable must be a boolean'),
  body('rentalPricePerDay')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rental price must be a non-negative number'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),
  validateResult,
];

// ==========================================
// Product Update Validator
// ==========================================
export const updateProductValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product title cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product title must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('brand')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Brand cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of strings'),
  body('platform')
    .optional()
    .isArray()
    .withMessage('Platform must be an array of strings'),
  body('condition')
    .optional()
    .isIn(['New', 'Used'])
    .withMessage('Condition must be New or Used'),
  body('rentalAvailable')
    .optional()
    .isBoolean()
    .withMessage('rentalAvailable must be a boolean'),
  body('rentalPricePerDay')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rental price must be a non-negative number'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),
  validateResult,
];
