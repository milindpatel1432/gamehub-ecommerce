import { body } from 'express-validator';
import { validateResult } from './authValidation.js';

export const createPaymentOrderValidator = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Order ID must be a valid Mongo ID'),
  validateResult,
];

export const verifyPaymentValidator = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Order ID must be a valid Mongo ID'),

  body('razorpayOrderId')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Order ID is required'),

  body('razorpayPaymentId')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Payment ID is required'),

  body('razorpaySignature')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Signature is required'),

  validateResult,
];
