import { body } from 'express-validator';
import { validateResult } from './authValidation.js';

export const addToCartValidator = [
  body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Product ID must be a valid Mongo ID'),

  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer and at least 1'),

  body('isRental')
    .optional()
    .isBoolean()
    .withMessage('isRental must be a boolean value'),

  body('rentDuration')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('rentDuration cannot be empty'),

  validateResult,
];

export const updateCartItemValidator = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer and at least 1'),

  validateResult,
];
