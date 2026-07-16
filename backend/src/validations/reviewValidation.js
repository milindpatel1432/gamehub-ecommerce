import { body, param } from 'express-validator';
import { validateResult } from './authValidation.js';

export const createReviewValidator = [
  body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Product ID must be a valid Mongo ID'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),

  validateResult,
];

export const updateReviewValidator = [
  param('id')
    .isMongoId()
    .withMessage('Review ID must be a valid Mongo ID'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Comment cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),

  validateResult,
];

export const idParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validateResult,
];
