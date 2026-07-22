import { body, validationResult } from 'express-validator';

// Reusable middleware to check validation results and return formatted error messages
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: formattedErrors[0]?.message || 'Validation Failed',
      errors: formattedErrors,
    });
  }
  next();
};

// Register fields validation rules chain
export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must contain only alphanumeric characters and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateResult,
];

// Login fields validation rules chain (Supports both Email or Username)
export const loginValidator = [
  body('email')
    .optional()
    .trim(),
  body('username')
    .optional()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateResult,
];

// Forgot Password email validation rules chain
export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  validateResult,
];
