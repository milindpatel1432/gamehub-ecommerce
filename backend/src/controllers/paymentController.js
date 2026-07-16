import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// ==========================================
// Create Razorpay Order
// ==========================================
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify authorized user owner
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to place payment for this order',
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This order is already paid',
      });
    }

    // Initialize Razorpay SDK client
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
    });

    // 1 USD = 83 INR conversion rate for testing in Razorpay India ecosystem
    const conversionRate = 83;
    const amountInPaise = Math.round(order.total * conversionRate * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Save Razorpay order reference ID
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Razorpay order generated successfully',
      data: {
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_id',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        id: rzpOrder.id,
        receipt: rzpOrder.receipt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Verify Razorpay Payment Signature
// ==========================================
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature authenticity
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body.toString())
      .digest('hex');

    const isVerified = expectedSignature === razorpaySignature;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found matching payment receipt',
      });
    }

    if (isVerified) {
      order.paymentStatus = 'paid';
      order.paymentId = razorpayPaymentId;
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment signature verified and captured successfully',
        data: order,
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature received.',
      });
    }
  } catch (error) {
    next(error);
  }
};
