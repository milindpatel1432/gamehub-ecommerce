import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a non-negative number'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be less than 0%'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be less than 0'],
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    platform: {
      type: [String],
      default: [],
    },
    condition: {
      type: String,
      enum: {
        values: ['New', 'Used'],
        message: 'Condition must be either New or Used',
      },
      default: 'New',
    },
    rentalAvailable: {
      type: Boolean,
      default: false,
    },
    rentalPricePerDay: {
      type: Number,
      default: 0,
      min: [0, 'Rental price per day must be a non-negative number'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating average cannot be less than 0'],
        max: [5, 'Rating average cannot exceed 5'],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, 'Rating count cannot be less than 0'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexing slug for fast queries
ProductSchema.index({ slug: 1 });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
