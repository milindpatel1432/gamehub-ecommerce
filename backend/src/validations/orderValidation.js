import { body } from 'express-validator';
import { validateResult } from './authValidation.js';

export const createOrderValidator = [
  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isObject()
    .withMessage('Shipping address must be an object'),

  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Receiver name is required'),

  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City name is required'),

  body('shippingAddress.postal')
    .trim()
    .notEmpty()
    .withMessage('Postal/PIN code is required'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required'),

  body('deliveryMethod')
    .notEmpty()
    .withMessage('Delivery method is required')
    .isObject()
    .withMessage('Delivery method must be an object'),

  body('deliveryMethod.name')
    .trim()
    .notEmpty()
    .withMessage('Delivery speed/method name is required'),

  body('deliveryMethod.price')
    .notEmpty()
    .withMessage('Delivery cost is required')
    .isFloat({ min: 0 })
    .withMessage('Delivery price must be a non-negative number'),

  validateResult,
];

export const updateOrderStatusValidator = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Status must be Processing, Shipped, Delivered, or Cancelled'),

  validateResult,
];
