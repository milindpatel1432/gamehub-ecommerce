import { body, param } from 'express-validator';
import { validateResult } from './authValidation.js';

export const addToWishlistValidator = [
  body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Product ID must be a valid Mongo ID'),
  validateResult,
];

export const wishlistIdParamValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isMongoId()
    .withMessage('ID must be a valid Mongo ID'),
  validateResult,
];
