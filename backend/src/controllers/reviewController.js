import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// ==========================================
// Helper to Recalculate Average Rating Stats
// ==========================================
const updateProductRatingStats = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': parseFloat(stats[0].averageRating.toFixed(1)),
        'rating.count': stats[0].count
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': 0,
        'rating.count': 0
      });
    }
  } catch (err) {
    console.error('Error recalculating average rating stats:', err);
  }
};

// ==========================================
// Create Review
// ==========================================
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product. You can update your existing review.',
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });

    // Recalculate stats
    await updateProductRatingStats(productId);

    // Populate user info for client return
    const populated = await review.populate('user', 'fullName username email');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Product Reviews
// ==========================================
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'fullName username email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Review
// ==========================================
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this review',
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Recalculate stats
    await updateProductRatingStats(review.product);

    const populated = await review.populate('user', 'fullName username email');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Review (Owner or Admin)
// ==========================================
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify ownership or admin role
    const isOwner = review.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate stats
    await updateProductRatingStats(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Admin Only: Get All Reviews
// ==========================================
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'fullName email')
      .populate('product', 'title category platform')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
