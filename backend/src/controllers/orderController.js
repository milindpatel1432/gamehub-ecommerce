import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// ==========================================
// Create Order
// ==========================================
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, deliveryMethod, items: payloadItems } = req.body;

    console.log(`[Order API] createOrder requested by user: ${req.user?.id}`);
    console.log(`[Order API] Payload items count: ${Array.isArray(payloadItems) ? payloadItems.length : 0}`);

    // 1. Fetch user's cart populated with product details
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    let cartItemsList = cart ? cart.items.filter((i) => i && i.product) : [];

    console.log(`[Order API] DB Cart items count: ${cartItemsList.length}`);

    // Fallback: If DB cart is empty, construct items from payloadItems passed from frontend
    if (cartItemsList.length === 0 && Array.isArray(payloadItems) && payloadItems.length > 0) {
      console.log(`[Order API] DB Cart is empty. Using ${payloadItems.length} items from frontend payload fallback.`);
      const constructedList = [];
      for (const pItem of payloadItems) {
        const prodId = pItem.product || pItem.productId || pItem.id;
        if (prodId) {
          const prodDoc = await Product.findById(prodId);
          if (prodDoc) {
            constructedList.push({
              product: prodDoc,
              quantity: pItem.quantity || 1,
              price: pItem.price || prodDoc.price,
              mode: pItem.mode || 'buy',
              duration: pItem.duration || '7 Days',
              deposit: pItem.deposit || 0,
            });
          }
        }
      }
      cartItemsList = constructedList;
    }

    if (!cartItemsList || cartItemsList.length === 0) {
      console.error(`[Order API] Order failed: Shopping cart is empty for user ${req.user?.id}`);
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty',
      });
    }

    // 2. Validate product stock levels
    for (const item of cartItemsList) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: 'One of the products in your cart no longer exists',
        });
      }
      if (item.product.stock < item.quantity) {
        console.warn(`[Order API] Insufficient stock for product ${item.product.title}`);
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product.title}". Available stock: ${item.product.stock}`,
        });
      }
    }

    // 3. Subtract stock from each ordered product
    for (const item of cartItemsList) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 4. Calculate prices
    let subtotal = 0;
    const orderItems = cartItemsList.map((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
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

    // 6. Clear user's DB Cart ONLY after order document is created
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    console.log(`[Order API] Order #${order._id} created successfully! Total: ₹${total}`);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('[Order API] Exception during createOrder:', error);
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
    order.paymentStatus = order.paymentMethod === 'cod' ? 'pending' : 'failed';
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
