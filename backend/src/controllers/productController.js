import Product from '../models/Product.js';

// ==========================================
// Slug Generation Helpers
// ==========================================
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = slugify(title);
  let uniqueSlug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const slugExists = await Product.findOne(query);
    if (!slugExists) {
      break;
    }
    uniqueSlug = `${baseSlug}-${count}`;
    count++;
  }
  return uniqueSlug;
};

// ==========================================
// Create Product
// ==========================================
export const createProduct = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = await generateUniqueSlug(req.body.title);
    }
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Active Products (Newest First)
// ==========================================
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Product By ID (Only Active)
// ==========================================
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Product
// ==========================================
export const updateProduct = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = await generateUniqueSlug(req.body.title, req.params.id);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Product (Soft Delete)
// ==========================================
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully (soft delete)',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
