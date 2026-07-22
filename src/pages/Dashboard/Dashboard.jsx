import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/logo.webp';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { successToast } from '../../utils/toast';
import {
  Home,
  Gamepad2,
  Heart,
  Settings,
  LogOut,
  Bell,
  Hexagon,
  Download,
  ShoppingBag,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardOrders from '../../components/dashboard/DashboardOrders';
import DashboardRentals from '../../components/dashboard/DashboardRentals';
import DashboardProfile from '../../components/dashboard/DashboardProfile';
import DashboardSettings from '../../components/dashboard/DashboardSettings';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const handleLogout = async () => {
    await logout();
    successToast('Logged out successfully.');
    navigate('/login');
  };

  // Close mobile drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Fetch real featured products from backend API / database
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await productService.getAllProducts({ limit: 12 });
        if (res?.data && res.data.length > 0) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'orders', label: 'Library', icon: Gamepad2 },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Carousel Next / Prev handlers
  const handleNextCarousel = () => {
    if (featuredProducts.length > 3) {
      setCarouselIndex((prev) => (prev + 1) % (featuredProducts.length - 2));
    }
  };

  const handlePrevCarousel = () => {
    if (featuredProducts.length > 3) {
      setCarouselIndex((prev) => (prev - 1 + (featuredProducts.length - 2)) % (featuredProducts.length - 2));
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      successToast(`Removed ${product.title} from wishlist`);
    } else {
      addToWishlist(product);
      successToast(`Added ${product.title} to wishlist`);
    }
  };

  return (
    <div className="w-full bg-[#060914] min-h-screen text-slate-200 text-left font-sans flex flex-col">
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto min-h-screen">
        
        {/* ============================================================ */}
        {/* LEFT SIDEBAR (Matching Reference UI)                        */}
        {/* ============================================================ */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#0b0f1d]/90 border-r border-slate-800/80 p-6 flex-shrink-0 justify-between sticky top-0 h-screen z-30 backdrop-blur-xl">
          <div className="space-y-8">
            
            {/* Logo Brand Header */}
            <Link to="/" className="flex items-center group">
              <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.2)] group-hover:border-cyan-400 transition-all">
                <img
                  src={logo}
                  alt="GameHub Logo"
                  className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                />
              </div>
            </Link>

            {/* User Profile Snippet */}
            <div className="flex items-center gap-3.5 pt-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400/50 bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-gaming text-sm font-black text-black shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                  {user?.fullName?.charAt(0).toUpperCase() || 'M'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0f1d]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs truncate max-w-[130px]">
                  {user?.fullName || 'Pro Gamer'}
                </h4>
                <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block">
                  Elite Tier
                </span>
              </div>
            </div>

            {/* Navigation Menu Stack */}
            <nav className="space-y-2 pt-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center gap-3.5 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)]'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Upgrade to Pro CTA */}
          <div className="space-y-4 pt-6 border-t border-slate-800/60">
            <button
              onClick={() => successToast('Pro Membership activated!')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-bold text-xs tracking-wide hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Upgrade to Pro</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-xs font-bold text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 py-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER OVERLAY */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative flex flex-col w-64 bg-[#0b0f1d] border-r border-slate-800 p-6 justify-between z-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      <div className="h-9 w-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-sm">
                        <img src={logo} alt="GameHub Logo" className="h-6 w-auto object-contain" />
                      </div>
                    </Link>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-cyan-400 bg-cyan-400/10 flex items-center justify-center font-gaming text-sm font-bold text-cyan-400">
                      {user?.fullName?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs truncate max-w-[120px]">
                        {user?.fullName || 'Pro Gamer'}
                      </h4>
                      <span className="text-[10px] text-cyan-400 uppercase font-semibold">Elite Tier</span>
                    </div>
                  </div>

                  <nav className="space-y-1 pt-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full h-11 px-4 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all ${
                          activeTab === item.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      successToast('Pro Membership activated!');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-xs font-bold text-slate-500 hover:text-red-400 py-1 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* RIGHT MAIN WORKSPACE CONTENT                                 */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-10 space-y-8">
          
          {/* TOP BAR: Welcome + User Points + Notification Bell */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Mobile menu toggle button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/">
                <div className="h-9 w-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <img src={logo} alt="GameHub Logo" className="h-6 w-auto object-contain" />
                </div>
              </Link>
            </div>

            {/* Welcome Greeting */}
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Marcus'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your gaming empire is ready for action.
              </p>
            </div>

            {/* Points & Notification Pill Actions */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="h-10 px-4 rounded-xl bg-[#0b1329] border border-blue-500/30 text-cyan-400 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <Hexagon className="h-4 w-4 fill-cyan-400/20 text-cyan-400" />
                <span>1,250 PTS</span>
              </div>
              <button
                onClick={() => successToast('No new notifications')}
                className="relative h-10 w-10 rounded-xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
              </button>
            </div>
          </div>

          {/* MAIN TAB SWITCHING CONTROLLER */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              
              {/* STATS CARDS GRID */}
              <DashboardStats wishlistCount={wishlistItems.length} totalOrders={12} activeRentals={3} />

              {/* MIDDLE SECTION: RECENT ACTIVITY & PROMOTIONAL CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Left Column: Recent Activity (2 Cols) */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-[#0b0f1d]/80 backdrop-blur-xl p-6 flex flex-col justify-between space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-lg font-bold text-white tracking-wide">
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Activity 1 */}
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-all">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                        <Download className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-xs truncate">
                          Downloaded &quot;Cyber Nexus 2077&quot;
                        </h4>
                        <span className="text-[11px] text-slate-500 block mt-0.5">2 hours ago</span>
                      </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-all">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-xs truncate">
                          Purchased &quot;Eternal Odyssey Premium Pack&quot;
                        </h4>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Yesterday</span>
                      </div>
                    </div>

                    {/* Activity 3 */}
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-all">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-xs truncate">
                          Earned Achievement: &quot;First Rental&quot;
                        </h4>
                        <span className="text-[11px] text-slate-500 block mt-0.5">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Promotional Cards Stack (1 Col) */}
                <div className="space-y-4 flex flex-col justify-between">
                  {/* Card 1: Browse New Games */}
                  <div
                    onClick={() => navigate('/shop')}
                    className="group relative h-40 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 p-5 flex flex-col justify-end cursor-pointer transition-all duration-300 shadow-lg"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
                      alt="Browse New Games"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060914] via-[#060914]/60 to-transparent" />
                    <div className="relative z-10 space-y-1">
                      <h4 className="font-sans text-base font-extrabold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                        Browse New Games
                      </h4>
                      <p className="text-xs text-slate-300">
                        Explore the latest AAA titles
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Check Rental Offers */}
                  <div
                    onClick={() => navigate('/shop')}
                    className="group relative h-40 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 p-5 flex flex-col justify-end cursor-pointer transition-all duration-300 shadow-lg"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
                      alt="Check Rental Offers"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060914] via-[#060914]/60 to-transparent" />
                    <div className="relative z-10 space-y-1">
                      <h4 className="font-sans text-base font-extrabold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                        Check Rental Offers
                      </h4>
                      <p className="text-xs text-slate-300">
                        Access games starting at ₹199
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* ============================================================ */}
              {/* EXCLUSIVE PRO DEALS (FEATURED PRODUCTS SECTION)              */}
              {/* ============================================================ */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-xl font-extrabold text-white tracking-tight">
                    Exclusive Pro Deals
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevCarousel}
                      className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNextCarousel}
                      className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 3 Columns Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredProducts.slice(carouselIndex, carouselIndex + 3).map((product) => {
                    const isWish = isInWishlist(product.id);
                    return (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -4 }}
                        className="group rounded-2xl border border-slate-800/80 bg-[#0b0f1d]/90 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 shadow-xl"
                      >
                        {/* Image Header with Badge */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Badge */}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-500/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-md">
                            {product.isSale ? `-${product.discount || 40}%` : product.rentalAvailable ? 'RENTAL' : 'NEW'}
                          </span>
                        </div>

                        {/* Card Info Content */}
                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-white text-base truncate group-hover:text-cyan-400 transition-colors">
                                {product.title}
                              </h3>
                              <button
                                onClick={() => toggleWishlist(product)}
                                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                  isWish ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-rose-500'
                                }`}
                              >
                                <Heart className="h-4.5 w-4.5" />
                              </button>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                                {product.category || 'RPG'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                                {product.platform || 'ACTION'}
                              </span>
                            </div>
                          </div>

                          {/* Footer Price & Action Button */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                            <div>
                              {product.originalPrice && (
                                <span className="text-xs text-slate-500 line-through block leading-none">
                                  ₹{product.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="font-gaming text-lg font-extrabold text-white">
                                ₹{product.buyPrice?.toFixed(2)}
                              </span>
                            </div>

                            {product.rentalAvailable ? (
                              <button
                                onClick={() => {
                                  addToCart(product);
                                  successToast(`Added ${product.title} rental to cart!`);
                                }}
                                className="h-9 px-4 rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 font-bold text-xs transition-all duration-200 cursor-pointer"
                              >
                                Rent
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  addToCart(product);
                                  successToast(`Added ${product.title} to shopping cart!`);
                                }}
                                className="h-9 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                              >
                                Buy Now
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================ */}
              {/* DASHBOARD FOOTER (Matching Reference Image Layout)          */}
              {/* ============================================================ */}
              <footer className="pt-10 pb-6 border-t border-slate-800/80 text-center space-y-4">
                <div className="flex justify-center items-center gap-6 text-xs text-slate-400">
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                  <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>
                <p className="text-[11px] text-slate-600">
                  &copy; {new Date().getFullYear()} GameHub Elite. All rights reserved.
                </p>
              </footer>

            </div>
          )}

          {/* OTHER TABS: Orders, Rentals, Wishlist, Profile, Settings */}
          {activeTab === 'orders' && <DashboardOrders />}
          {activeTab === 'rentals' && <DashboardRentals />}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-sans text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                  My Wishlist
                </h3>
                <Link to="/wishlist" className="text-xs font-bold text-cyan-400 hover:underline">
                  Manage Full Page &rarr;
                </Link>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-800 bg-[#0b0f1d]/80 overflow-hidden justify-between p-4 space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs truncate max-w-[120px]">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.platform || 'Digital'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                        <span className="font-gaming text-xs font-extrabold text-cyan-400">₹{item.buyPrice?.toFixed(2)}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              addToCart(item);
                              removeFromWishlist(item.id);
                              successToast(`Moved ${item.title} to cart!`);
                            }}
                            className="h-8 px-3.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-[10px] cursor-pointer"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-[10px] font-bold text-rose-400 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-500 text-sm font-semibold">Your wishlist is empty.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'profile' && <DashboardProfile user={user} />}
          {activeTab === 'settings' && <DashboardSettings />}

        </div>
      </div>
    </div>
  );
}
