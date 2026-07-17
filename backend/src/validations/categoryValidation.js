import { body } from 'express-validator';
import { validateResult } from './authValidation.js';

export const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Category slug is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category slug must be between 2 and 50 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),

  body('description')
    .optional()
    .trim(),

  body('image')
    .optional()
    .trim(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  validateResult,
];

export const updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  body('slug')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category slug cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category slug must be between 2 and 50 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),

  body('description')
    .optional()
    .trim(),

  body('image')
    .optional()
    .trim(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  validateResult,
];
