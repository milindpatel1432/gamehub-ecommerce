import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ShoppingBag, Heart, Eye, Check, ArrowRight, Star, 
  ShieldCheck, Zap, Lock, RotateCcw, Headphones, Award, ChevronDown, 
  SlidersHorizontal, X, Layers, Cpu, HardDrive, Gamepad2, Sparkles, Scale,
  Calendar, RefreshCw, Truck, Clock, ShieldAlert, CheckCircle2, Calculator
} from 'lucide-react';
import { 
  rentalCategories, 
  rentalBrands, 
  rentalDurations, 
  rentalProducts, 
  rentalBundles, 
  rentalProcessSteps, 
  rentalFAQs, 
  rentalReviews 
} from '../../data/rentalsData';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { successToast, infoToast } from '../../utils/toast';

export default function Rentals() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist: addToWishlistContext, removeFromWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal, setIntentAndOpenAuth } = useAuth();

  // State Management
  const [productsList, setProductsList] = useState(rentalProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedDurationDays, setSelectedDurationDays] = useState(7);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(1500); // Per day price filter
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Accordions
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewDuration, setQuickViewDuration] = useState(7);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(0);

  const catalogRef = useRef(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch products from MongoDB API that have rentalAvailable = true
  useEffect(() => {
    const fetchMongoDBRentalProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await productService.getAllProducts({ rentalAvailable: true, limit: 100 });
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mappedDbProducts = res.data.map((p) => {
            const dailyRent = p.rentalPricePerDay || Math.round((p.buyPrice || p.price || 4000) * 0.08) || 399;
            return {
              id: p.id || p._id,
              name: p.title || p.name,
              category: p.category === 'Gaming Consoles' || p.category === 'Consoles' ? 'Gaming Consoles' : (p.category || 'Gaming Consoles'),
              brand: p.brand === 'Sony' ? 'PlayStation' : p.brand === 'Microsoft' ? 'Xbox' : (p.brand || 'PlayStation'),
              condition: p.condition === 'Pre-owned' ? 'Sanitized Refurbished' : 'Mint (Sanitized)',
              perDayPrice: dailyRent,
              weeklyPrice: Math.round(dailyRent * 7 * 0.85),
              monthlyPrice: Math.round(dailyRent * 30 * 0.60),
              securityDeposit: p.buyPrice ? Math.round(p.buyPrice * 0.3) : 5000,
              rating: typeof p.rating === 'number' ? p.rating : (p.rating?.average || 4.8),
              reviewCount: p.reviews || (p.rating?.count || 120),
              inStock: p.stock > 0,
              badge: p.featured ? 'FEATURED RENTAL' : 'AVAILABLE NOW',
              image: p.image || (Array.isArray(p.images) && p.images[0]) || p.thumbnail || 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
              description: p.description || p.shortDescription || 'High performance gaming equipment available for flexible rental.',
              includes: ['Main Unit & Power Cables', '1x Controller / Cable Set', 'Sanitization Certification', 'Complimentary Damage Protection'],
              specs: {
                Resolution: '4K Ultra High Definition',
                Storage: 'Fast NVMe SSD',
                Sanitization: '100% UV-C Sterilized & Diagnostic Tested',
                Delivery: 'Free Doorstep Delivery & Pickup'
              }
            };
          });

          // Combine DB rental items with static fallback items
          const dbIds = new Set(mappedDbProducts.map(item => String(item.id)));
          const remainingStatic = rentalProducts.filter(item => !dbIds.has(String(item.id)));
          setProductsList([...mappedDbProducts, ...remainingStatic]);
        }
      } catch (err) {
        console.warn('[Rentals] Could not load from MongoDB backend API. Using local rental dataset:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchMongoDBRentalProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (selectedCategory !== 'all') {
        const catObj = rentalCategories.find(c => c.id === selectedCategory);
        if (catObj && product.category.toLowerCase() !== catObj.name.toLowerCase() && !product.category.toLowerCase().includes(catObj.id)) {
          return false;
        }
      }
      if (selectedBrand !== 'All' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (product.perDayPrice > priceRange) {
        return false;
      }
      if (searchQuery.trim() && !product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.perDayPrice - b.perDayPrice;
      if (sortBy === 'price-high') return b.perDayPrice - a.perDayPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return String(b.id).localeCompare(String(a.id));
      return 0; // Default featured
    });
  }, [productsList, selectedCategory, selectedBrand, inStockOnly, priceRange, sortBy, searchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, inStockOnly, priceRange, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const calculateRentalTotal = (product, days) => {
    let multiplier = 1;
    if (days >= 30) multiplier = 0.60;
    else if (days >= 15) multiplier = 0.75;
    else if (days >= 7) multiplier = 0.85;

    const baseCost = Math.round(product.perDayPrice * days * multiplier);
    return {
      rentAmount: baseCost,
      deposit: product.securityDeposit,
      totalToPay: baseCost + product.securityDeposit
    };
  };

  const handleAddToCart = (product, days = selectedDurationDays) => {
    const durationLabel = days === 3 ? '3 Days' : days === 7 ? '7 Days' : days === 15 ? '15 Days' : '30 Days';
    const totals = calculateRentalTotal(product, days);

    const cartPayload = {
      id: product.id,
      productId: product.id,
      title: product.name,
      mode: 'rent',
      price: totals.rentAmount,
      deposit: product.securityDeposit,
      duration: durationLabel,
      image: product.image,
      inStock: product.inStock
    };

    if (!isAuthenticated) {
      setIntentAndOpenAuth({
        action: 'ADD_TO_CART',
        payload: { product: cartPayload, quantity: 1 },
        redirectTo: window.location.pathname + window.location.search + window.location.hash,
      });
      return;
    }

    addToCart(cartPayload);
  };

  const handleToggleWishlist = (product) => {
    if (!isAuthenticated) {
      setIntentAndOpenAuth({
        action: 'ADD_TO_WISHLIST',
        payload: {
          product: {
            id: product.id,
            title: product.name,
            price: product.perDayPrice,
            image: product.image,
          },
        },
        redirectTo: window.location.pathname + window.location.search + window.location.hash,
      });
      return;
    }
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlistContext({
        id: product.id,
        title: product.name,
        price: product.perDayPrice,
        image: product.image,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-slate-100 pb-20 overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Color Grading Matched to Consoles.jsx) */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-gaming-border overflow-hidden bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        {/* Ambient Glowing Background Lights */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gaming-cyan/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gaming-accent/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-gaming-cyan" /> Official Gear & Console Rental Marketplace
              </div>

              <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Play Premium Gear <br />
                <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  Without Buying
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Rent top-tier PlayStation 5, Xbox Series X, Meta Quest 3 VR, and RTX Gaming Laptops starting at just <span className="text-gaming-cyan font-bold">₹299/day</span>. 100% UV-Sterilized, zero hassle digital KYC, and instant doorstep delivery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={scrollToCatalog}
                  className="h-12 px-7 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  Explore Rental Catalog
                </button>

                <a
                  href="#how-it-works"
                  className="h-12 px-6 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 font-semibold text-xs transition-all duration-300 flex items-center gap-2 hover:border-gaming-cyan/40 backdrop-blur-md"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gaming-cyan" />
                  How Rental Works
                </a>
              </div>

              {/* Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gaming-border/60">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">100%</p>
                  <p className="text-xs text-slate-400">UV-C Sterilized</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gaming-cyan">Free</p>
                  <p className="text-xs text-slate-400">Doorstep Pickup</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">2 Hours</p>
                  <p className="text-xs text-slate-400">Deposit Return</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">Assured</p>
                  <p className="text-xs text-slate-400">Damage Protection</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Image Glass Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-gaming-cyan/30 bg-gaming-card/40 p-4 backdrop-blur-xl shadow-[0_0_50px_rgba(0,229,255,0.25)] group">
                <img 
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80" 
                  alt="PS5 Rental Pass" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-black via-transparent to-transparent opacity-60" />
                
                {/* Floating Glass Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-gaming-black/80 border border-gaming-cyan/30 backdrop-blur-md flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gaming-cyan font-bold block">Featured Rental</span>
                    <p className="font-gaming text-sm font-bold text-white">PS5 Digital Edition Bundle</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gaming-cyan text-gaming-black font-bold text-xs">
                    ₹399/day
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. RENTAL BUNDLES / SUPER SAVER PACKS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Super Saver Rental Bundles
            </h2>
            <p className="text-sm text-slate-400 mt-2">Pre-configured console + accessories + game pass packages</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rentalBundles.map((bundle) => (
              <motion.div
                key={bundle.id}
                whileHover={{ y: -6 }}
                className="glass-card relative rounded-2xl border border-gaming-border bg-gaming-card/60 p-6 hover:border-gaming-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden mb-4 h-44 bg-gaming-black/50">
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-gaming-cyan text-gaming-black text-[9px] font-extrabold uppercase">
                      {bundle.tag}
                    </span>
                    <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-semibold text-gaming-cyan uppercase tracking-wider">{bundle.duration} Rental Plan</span>
                  <h3 className="font-gaming text-lg font-bold text-white mt-1">{bundle.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{bundle.subtitle}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gaming-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 line-through mr-2">₹{bundle.originalPrice}</span>
                    <span className="font-gaming text-xl font-extrabold text-white">₹{bundle.price}</span>
                    <span className="text-[10px] text-slate-400 block">+ ₹{bundle.deposit} Refundable Deposit</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (!isAuthenticated) { openAuthModal('login'); return; }
                      addToCart({
                        id: bundle.id,
                        productId: bundle.id,
                        title: bundle.title,
                        mode: 'rent',
                        price: bundle.price,
                        deposit: bundle.deposit,
                        duration: bundle.duration,
                        image: bundle.image,
                        inStock: true
                      });
                    }}
                    className="p-3 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan hover:bg-gaming-cyan hover:text-gaming-black transition-all duration-200 font-bold cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. MAIN CATALOG SECTION & STICKY FILTER SIDEBAR */}
      {/* ========================================================================= */}
      <section ref={catalogRef} className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                Available Rental Equipment
              </h2>
              <p className="text-sm text-slate-400 mt-1">Browse, filter, and reserve high performance gaming hardware</p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {rentalCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                      : 'bg-gaming-card border border-gaming-border text-slate-300 hover:border-gaming-cyan/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Duration Bar, Mobile Filter Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search PS5, Xbox, Quest 3, ROG Ally..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tenure Selector */}
            <div className="lg:col-span-4 flex items-center bg-gaming-black rounded-xl border border-gaming-border p-1">
              <span className="text-xs text-slate-400 px-3 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gaming-cyan" /> Tenure:
              </span>
              {rentalDurations.map((dur) => (
                <button
                  key={dur.days}
                  onClick={() => setSelectedDurationDays(dur.days)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDurationDays === dur.days
                      ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dur.days}D
                </button>
              ))}
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="lg:col-span-3 flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-gaming-border bg-gaming-black text-xs font-semibold text-slate-200 focus:outline-none focus:border-gaming-cyan cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Rent: Low to High</option>
                <option value="price-high">Rent: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden h-10 px-4 rounded-xl border border-gaming-border bg-gaming-card text-xs font-semibold text-slate-200 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-gaming-cyan" />
              </button>
            </div>
          </div>

          {/* Grid Layout (Pinned Sticky Sidebar + Product Catalog) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            
            {/* Desktop Pinned Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gaming-border bg-gaming-card/50 p-6 backdrop-blur-xl space-y-6 scrollbar-thin scrollbar-thumb-gaming-cyan/30 pr-3">
              <div className="flex items-center justify-between border-b border-gaming-border pb-4">
                <span className="font-gaming text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gaming-cyan" /> Filter Equipment
                </span>
                <button
                  onClick={() => {
                    setSelectedBrand('All');
                    setSelectedCategory('all');
                    setInStockOnly(false);
                    setPriceRange(1500);
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-slate-400 hover:text-gaming-cyan cursor-pointer transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2.5 block">Brand / Ecosystem</label>
                <div className="space-y-1.5">
                  {rentalBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedBrand === brand.id
                          ? 'bg-gaming-cyan/15 text-gaming-cyan border border-gaming-cyan/30 font-bold'
                          : 'text-slate-400 hover:bg-gaming-black hover:text-slate-200'
                      }`}
                    >
                      <span>{brand.name}</span>
                      {selectedBrand === brand.id && <Check className="w-3.5 h-3.5 text-gaming-cyan" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Max Rent Per Day</label>
                  <span className="text-xs font-bold text-gaming-cyan">₹{priceRange}/day</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1500}
                  step={50}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gaming-cyan bg-gaming-black rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2 border-t border-gaming-border">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-300">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-gaming-cyan cursor-pointer"
                  />
                </label>
              </div>

              {/* Callout */}
              <div className="p-3.5 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/20 text-xs space-y-1">
                <span className="font-bold text-gaming-cyan flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Refundable Deposit
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Deposits are credited back within 2-4 hours after doorstep pickup.
                </p>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="lg:col-span-9 flex flex-col justify-between">
              
              {isLoadingProducts ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-gaming-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading live rental inventory...</p>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="p-12 rounded-3xl border border-gaming-border bg-gaming-card/40 text-center space-y-4">
                  <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="font-gaming text-lg font-bold text-white">No Rental Equipment Found</h3>
                  <p className="text-xs text-slate-400">Try adjusting your filter options or price slider.</p>
                  <button
                    onClick={() => {
                      setSelectedBrand('All');
                      setSelectedCategory('all');
                      setPriceRange(1500);
                      setSearchQuery('');
                    }}
                    className="px-5 py-2 rounded-xl bg-gaming-cyan text-gaming-black text-xs font-bold cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const totals = calculateRentalTotal(product, selectedDurationDays);
                    const wishlisted = isWishlisted(product.id);

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/60 p-5 hover:border-gaming-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 relative group"
                      >
                        {/* Image Frame */}
                        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gaming-black/60 mb-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                            <span className="px-2 py-0.5 rounded-full bg-gaming-cyan/90 text-gaming-black text-[9px] font-extrabold uppercase">
                              {product.badge || 'RENTAL'}
                            </span>
                          </div>

                          {/* Wishlist Button */}
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer z-10 ${
                              wishlisted
                                ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                : 'bg-gaming-black/60 border-white/20 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Card Details */}
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                              <span className="font-semibold text-gaming-cyan">{product.brand}</span>
                              <span className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-3 h-3 fill-current" /> {product.rating} ({product.reviewCount})
                              </span>
                            </div>

                            <h3 className="font-gaming text-base font-bold text-white line-clamp-1 group-hover:text-gaming-cyan transition-colors">
                              {product.name}
                            </h3>

                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          {/* Price & Tenure Box */}
                          <div className="p-3 rounded-xl bg-gaming-black/60 border border-gaming-border flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block">{selectedDurationDays}-Day Total Rent</span>
                              <span className="font-gaming text-lg font-extrabold text-white">₹{totals.rentAmount}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Rate / Day</span>
                              <span className="font-bold text-gaming-cyan text-xs">₹{product.perDayPrice}/d</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Refundable Deposit:</span>
                            <span className="font-bold text-slate-200">₹{product.securityDeposit}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={() => {
                                setQuickViewProduct(product);
                                setQuickViewDuration(selectedDurationDays);
                              }}
                              className="h-9 rounded-xl border border-gaming-border bg-gaming-black/60 hover:bg-gaming-card text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-gaming-cyan" />
                              <span>Specs</span>
                            </button>

                            <button
                              onClick={() => handleAddToCart(product, selectedDurationDays)}
                              className="h-9 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Rent Now</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-10">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        currentPage === idx + 1
                          ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                          : 'bg-gaming-card border border-gaming-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. HOW RENTAL WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              How GameHub Rental Works
            </h2>
            <p className="text-sm text-slate-400">
              Renting your dream gaming gear is fast, transparent, and 100% digital
            </p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalProcessSteps.map((step, idx) => (
              <div key={idx} className="glass-card relative rounded-2xl border border-gaming-border bg-gaming-card/40 p-6 space-y-3">
                <span className="font-gaming text-4xl font-black text-gaming-cyan/30 block">{step.step}</span>
                <h3 className="font-gaming text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. REVIEWS & FAQS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-gaming text-2xl font-extrabold text-white">Gamer Testimonials</h2>
                <p className="text-xs text-slate-400 mt-1">Real experiences from verified GameHub renters</p>
              </div>

              <div className="space-y-4">
                {rentalReviews.map((rev, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-gaming-border bg-gaming-card/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rev.name} <span className="font-normal text-slate-400">({rev.city})</span></span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">"{rev.comment}"</p>
                    <span className="text-[11px] text-gaming-cyan font-semibold block">Gear: {rev.gear}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="font-gaming text-2xl font-extrabold text-white">Rental FAQs</h2>
                <p className="text-xs text-slate-400 mt-1">Clear answers on security deposits, delivery, and damage policies</p>
              </div>

              <div className="space-y-3">
                {rentalFAQs.map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-gaming-border bg-gaming-card/40 overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? -1 : idx)}
                      className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:text-gaming-cyan transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedFAQ === idx ? 'rotate-180 text-gaming-cyan' : 'text-slate-400'}`} />
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-gaming-border/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. QUICK VIEW MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gaming-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-gaming-card border border-gaming-cyan/30 rounded-3xl p-6 overflow-hidden shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gaming-black/60 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-56 object-cover rounded-2xl bg-gaming-black" />

                <div className="space-y-3">
                  <span className="text-xs font-bold text-gaming-cyan uppercase">{quickViewProduct.brand}</span>
                  <h3 className="font-gaming text-xl font-extrabold text-white">{quickViewProduct.name}</h3>
                  <p className="text-xs text-slate-300">{quickViewProduct.description}</p>

                  <div className="pt-2">
                    <span className="text-xs text-slate-400 block mb-1">Select Rental Period:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[3, 7, 15, 30].map((d) => (
                        <button
                          key={d}
                          onClick={() => setQuickViewDuration(d)}
                          className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            quickViewDuration === d ? 'bg-gaming-cyan text-gaming-black' : 'bg-gaming-black text-slate-400'
                          }`}
                        >
                          {d}D
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculations breakdown */}
              {(() => {
                const modalTotals = calculateRentalTotal(quickViewProduct, quickViewDuration);
                return (
                  <div className="p-4 rounded-xl bg-gaming-black/60 border border-gaming-border space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rent Amount ({quickViewDuration} Days):</span>
                      <span className="font-bold text-white">₹{modalTotals.rentAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Refundable Security Deposit:</span>
                      <span className="font-bold text-gaming-cyan">₹{modalTotals.deposit}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gaming-border font-bold text-sm">
                      <span>Total Due Now:</span>
                      <span className="text-white">₹{modalTotals.totalToPay}</span>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(quickViewProduct, quickViewDuration);
                        setQuickViewProduct(null);
                      }}
                      className="w-full py-3 mt-3 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add Rental to Cart
                    </button>
                  </div>
                );
              })()}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
