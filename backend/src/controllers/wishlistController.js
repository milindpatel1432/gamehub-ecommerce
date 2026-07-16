import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// ==========================================
// Get Wishlist
// ==========================================
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Add To Wishlist
// ==========================================
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    wishlist.products.addToSet(productId);
    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Remove From Wishlist
// ==========================================
export const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.id;

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products.pull(productId);
    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Move To Cart
// ==========================================
export const moveToCart = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { isRental, rentDuration } = req.body;

    // Check if item is in wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist || !wishlist.products.some(id => id.toString() === productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in your wishlist',
      });
    }

    // Check product exists
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
      deposit = 40.00;
    } else if (product.discount > 0) {
      price = Number((product.price * (1 - product.discount / 100)).toFixed(2));
    }

    // Find or create Cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.mode === mode
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1,
        price,
        mode,
        duration: rentDuration || '7 Days',
        dates: isRental ? 'Oct 25 - Nov 1' : undefined,
        deposit,
      });
    }

    await cart.save();

    // Pull from wishlist
    wishlist.products.pull(productId);
    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product moved to cart successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
