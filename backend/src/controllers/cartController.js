import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const calculateCartTotals = (cart) => {
  let subtotal = 0;
  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    const { subtotal, total } = calculateCartTotals(cart);
    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, isRental, rentDuration } = req.body;
    const qty = quantity ? parseInt(quantity, 10) : 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const mode = isRental ? 'rent' : 'buy';
    let price = product.price;
    let deposit = 0;

    if (isRental) {
      price = product.rentalPricePerDay || 0;
      deposit = 40.00; // Ref: matching $40.00 security deposit
    } else if (product.discount > 0) {
      price = Number((product.price * (1 - product.discount / 100)).toFixed(2));
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.mode === mode
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({
        product: productId,
        quantity: qty,
        price,
        mode,
        duration: rentDuration || '7 Days',
        dates: isRental ? 'Oct 25 - Nov 1' : undefined,
        deposit,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    const { subtotal, total } = calculateCartTotals(cart);
    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    let item = cart.items.id(req.params.id);
    if (!item) {
      item = cart.items.find((i) => i.product.toString() === req.params.id);
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    item.quantity = parseInt(quantity, 10);
    await cart.save();
    await cart.populate('items.product');

    const { subtotal, total } = calculateCartTotals(cart);
    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i._id.toString() === req.params.id || i.product.toString() === req.params.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product');

    const { subtotal, total } = calculateCartTotals(cart);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        _id: cart._id,
        user: cart.user,
        items: [],
        subtotal: 0,
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
