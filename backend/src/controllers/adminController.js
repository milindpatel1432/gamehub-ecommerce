import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-');
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
// 1. Dashboard Overview Stats
// ==========================================
export const getStats = async (req, res, next) => {
  try {
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPaidOrders = await Order.find({
      paymentStatus: 'paid',
      createdAt: { $gte: startOfMonth }
    });
    const monthlyRevenue = monthlyPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } });
    const acceptedOrders = await Order.countDocuments({ status: 'Accepted' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const registeredUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments({ isActive: true });
    const lowStockItems = await Product.countDocuments({ isActive: true, stock: { $lte: 5 } });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        monthlyRevenue,
        todaysOrders,
        totalOrders,
        pendingOrders,
        acceptedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        registeredUsers,
        totalProducts,
        totalCategories,
        lowStockItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. Product Management (Games & Consoles)
// ==========================================
export const getGames = async (req, res, next) => {
  try {
    const games = await Product.find({ category: 'Games' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: games
    });
  } catch (error) {
    next(error);
  }
};

export const addGame = async (req, res, next) => {
  try {
    req.body.category = 'Games';
    if (req.body.title) {
      req.body.slug = await generateUniqueSlug(req.body.title);
    }
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = await generateUniqueSlug(req.body.title, req.params.id);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    // Soft delete to protect referencing order items
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Consoles
export const getConsoles = async (req, res, next) => {
  try {
    const consoles = await Product.find({ category: 'Consoles' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: consoles
    });
  } catch (error) {
    next(error);
  }
};

export const addConsole = async (req, res, next) => {
  try {
    req.body.category = 'Consoles';
    if (req.body.title) {
      req.body.slug = await generateUniqueSlug(req.body.title);
    }
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Console created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateConsole = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = await generateUniqueSlug(req.body.title, req.params.id);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Console not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Console updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConsole = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Console not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Console deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. Order Management
// ==========================================
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getRentals = async (req, res, next) => {
  try {
    // Rentals are orders with rental mode items
    const orders = await Order.find({ 'items.mode': 'rent' })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. User Management
// ==========================================
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Single Super Admin System: Protect Super Admin account
    if (user.role === 'admin' || user.email === 'admin@gamehub.com' || user.username === 'milindadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Permanent Super Admin account cannot be blocked or suspended.' });
    }
    // Prevent blocking oneself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot block yourself' });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User is now ${user.isBlocked ? 'Blocked' : 'Active'}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Single Super Admin System: Protect Super Admin account
    if (userToDelete.role === 'admin' || userToDelete.email === 'admin@gamehub.com' || userToDelete.username === 'milindadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Permanent Super Admin account cannot be deleted.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. Revenue Analytics
// ==========================================
export const getAnalytics = async (req, res, next) => {
  try {
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const orders = await Order.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const revenue = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0);

      const rentalsCount = orders.reduce((sum, o) => {
        const rentItems = o.items.filter(item => item.mode === 'rent');
        return sum + rentItems.reduce((acc, it) => acc + it.quantity, 0);
      }, 0);

      const label = d.toLocaleString('en-US', { month: 'short' });
      chartData.push({
        label,
        revenue: Math.round(revenue),
        orders: orders.length,
        rentals: rentalsCount
      });
    }

    // Top selling gear / products
    const popularAggregation = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sales: { $sum: '$items.quantity' },
          rentCount: {
            $sum: {
              $cond: [{ $eq: ['$items.mode', 'rent'] }, '$items.quantity', 0]
            }
          }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 4 }
    ]);

    const popular = [];
    for (let item of popularAggregation) {
      const product = await Product.findById(item._id);
      if (product) {
        popular.push({
          title: product.title,
          category: product.category,
          sales: item.sales,
          rentCount: item.rentCount
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        chartData,
        popular
      }
    });
  } catch (error) {
    next(error);
  }
};
