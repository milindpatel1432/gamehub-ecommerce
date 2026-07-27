import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    enum: ['buy', 'rent'],
    required: true,
    default: 'buy',
  },
  duration: {
    type: String,
  },
  deposit: {
    type: Number,
    default: 0,
  },
});

const TrackingHistorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  stepKey: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postal: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    deliveryMethod: {
      name: { type: String, required: true },
      price: { type: Number, required: true, default: 0 },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    trackingInfo: {
      currentStatus: { type: String, default: 'Processing' },
      warehouseLocation: {
        name: { type: String, default: 'GameHub Central Fulfillment Hub' },
        lat: { type: Number, default: 19.0760 },
        lng: { type: Number, default: 72.8777 },
        address: { type: String, default: 'Plot 42, Logistics Park, BKC, Mumbai 400051' },
      },
      customerLocation: {
        name: { type: String },
        lat: { type: Number, default: 19.1136 },
        lng: { type: Number, default: 72.8697 },
        address: { type: String },
      },
      deliveryPartner: {
        name: { type: String, default: 'Vikram Sharma' },
        phone: { type: String, default: '+91 98200 11223' },
        vehicleNumber: { type: String, default: 'MH-02-GB-9921' },
        avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        rating: { type: Number, default: 4.9 },
      },
      trackingHistory: [TrackingHistorySchema],
      estimatedDelivery: { type: Date },
      distanceRemaining: { type: String, default: '4.2 km' },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
