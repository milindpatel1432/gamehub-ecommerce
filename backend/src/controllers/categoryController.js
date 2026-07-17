import Category from '../models/Category.js';
import Product from '../models/Product.js';

// ==========================================
// Create a new category (Admin Only)
// ==========================================
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    const existingName = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const existingSlug = await Category.findOne({ slug: slug.toLowerCase() });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A category with this slug already exists',
      });
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
      description,
      image,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Get all categories (Public / Admin)
// ==========================================
export const getAllCategories = async (req, res, next) => {
  try {
    // If query parameter activeOnly=true, return active categories only
    const filter = {};
    if (req.query.activeOnly === 'true') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter).sort({ name: 1 });

    // Populate product count for every category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat.name });
        return {
          id: cat._id,
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          isActive: cat.isActive,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Get single category by ID (Public)
// ==========================================
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const productCount = await Product.countDocuments({ category: category.name });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        id: category._id,
        productCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Update category by ID (Admin Only)
// ==========================================
export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check unique name constraints
    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      const existingName = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existingName) {
        return res.status(400).json({
          success: false,
          message: 'A category with this name already exists',
        });
      }
    }

    // Check unique slug constraints
    if (slug && slug.toLowerCase() !== category.slug) {
      const existingSlug = await Category.findOne({ slug: slug.toLowerCase() });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'A category with this slug already exists',
        });
      }
    }

    const oldName = category.name;

    // Apply updates
    if (name) category.name = name;
    if (slug) category.slug = slug.toLowerCase();
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    // Sync any product category references if category name changed
    if (name && name !== oldName) {
      await Product.updateMany({ category: oldName }, { category: name });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Delete category by ID (Admin Only)
// ==========================================
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Prevent deletion if category has products assigned to it
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because it contains ${productCount} products. Please reassign or delete the products first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
