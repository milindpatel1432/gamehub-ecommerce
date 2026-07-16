import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// ==========================================
// Create Order
// ==========================================
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, deliveryMethod } = req.body;

    // 1. Fetch user's cart populated with product details
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty',
      });
    }

    // 2. Validate product stock levels
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: 'One of the products in your cart no longer exists',
        });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product.title}". Available stock: ${item.product.stock}`,
        });
      }
    }

    // 3. Subtract stock from each ordered product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 4. Calculate prices
    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      subtotal += item.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        mode: item.mode,
        duration: item.duration,
        deposit: item.deposit,
      };
    });

    const tax = subtotal * 0.08;
    const shippingPrice = deliveryMethod?.price || 0;
    const total = subtotal + tax + shippingPrice;

    // 5. Create Order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'Processing',
    });

    // 6. Clear user's Cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Logged In User's Orders
// ==========================================
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Order By ID
// ==========================================
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify authorized caller (owner or admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order details',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order details retrieved successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Cancel Order
// ==========================================
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify authorized caller (owner or admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    if (order.status !== 'Processing') {
      return res.status(400).json({
        success: false,
        message: `Orders that are already ${order.status.toLowerCase()} cannot be cancelled`,
      });
    }

    // Restore stock levels
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = 'Cancelled';
    order.paymentStatus = order.paymentMethod === 'cod' ? 'pending' : 'failed'; // failed or refunded if paid
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Orders (Admin Only)
// ==========================================
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'fullName email username')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All orders retrieved successfully',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Order Status (Admin Only)
// ==========================================
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // If order is transitioning to Cancelled and was not cancelled before, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
