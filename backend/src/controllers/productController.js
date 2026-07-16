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
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/-+/g, '-');        // Replace multiple - with single -
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
    const queryObject = { isActive: true };

    // Regex Search
    if (req.query.search) {
      queryObject.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category Filter
    if (req.query.category) {
      queryObject.category = { $regex: new RegExp('^' + req.query.category + '$', 'i') };
    }

    // Brand Filter
    if (req.query.brand) {
      queryObject.brand = { $regex: new RegExp('^' + req.query.brand + '$', 'i') };
    }

    // Platform Filter
    if (req.query.platform) {
      queryObject.platform = { $regex: new RegExp('^' + req.query.platform + '$', 'i') };
    }

    // Condition Filter
    if (req.query.condition) {
      queryObject.condition = req.query.condition; // 'New' or 'Used'
    }

    // Rental Available Filter
    if (req.query.rentalAvailable !== undefined) {
      queryObject.rentalAvailable = req.query.rentalAvailable === 'true';
    }

    // Price Filter range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObject.price = {};
      if (req.query.minPrice) queryObject.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) queryObject.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Minimum Rating filter
    if (req.query.minRating) {
      queryObject['rating.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    // Sorting definition
    let sortCriteria = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'newest':
          sortCriteria = { createdAt: -1 };
          break;
        case 'price-asc':
          sortCriteria = { price: 1 };
          break;
        case 'price-desc':
          sortCriteria = { price: -1 };
          break;
        case 'rating':
          sortCriteria = { 'rating.average': -1 };
          break;
      }
    }

    // Pagination calculations
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(queryObject);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(queryObject)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        totalProducts,
        currentPage: page,
        totalPages
      },
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
