import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Shop from '../pages/Shop/Shop';
import ProductDetails from '../pages/Product/ProductDetails';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
import Wishlist from '../pages/Wishlist/Wishlist';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminCategories from '../pages/Admin/AdminCategories';
import AdminCoupons from '../pages/Admin/AdminCoupons';
import AdminOrders from '../components/admin/AdminOrders';
import AdminRentals from '../components/admin/AdminRentals';
import AdminUsers from '../components/admin/AdminUsers';
import AdminReviews from '../components/admin/AdminReviews';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminSettings from '../components/admin/AdminSettings';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestRoute from './GuestRoute';
import PageNotFound from '../pages/Error/PageNotFound';
import Unauthorized from '../pages/Error/Unauthorized';
import ServerError from '../pages/Error/ServerError';
import Orders from '../pages/Orders/Orders';
import OrderDetails from '../pages/Orders/OrderDetails';
import About from '../pages/About/About';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      
      {/* Protected Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" state={{ tab: 'profile' }} replace />
          </ProtectedRoute>
        }
      />

      {/* Guest-only Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />

      {/* Admin and Error Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="rentals" element={<AdminRentals />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/server-error" element={<ServerError />} />
      
      {/* Fallback route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
