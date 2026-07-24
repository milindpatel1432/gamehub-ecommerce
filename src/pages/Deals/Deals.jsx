import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ShoppingBag, Heart, Eye, Check, ArrowRight, Star, 
  ShieldCheck, Zap, Lock, RotateCcw, Headphones, Award, ChevronDown, 
  SlidersHorizontal, X, Layers, Cpu, HardDrive, Gamepad2, Sparkles, Scale,
  Flame, Tag, Copy, Clock, Percent, ShieldAlert, CheckCircle2, TrendingDown
} from 'lucide-react';
import { 
  dealCategories, 
  discountTiers, 
  activeCoupons, 
  dealProducts, 
  dealFAQs 
} from '../../data/dealsData';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { successToast, infoToast } from '../../utils/toast';

export default function Deals() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist: addToWishlistContext, removeFromWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();

  // State Management
  const [productsList, setProductsList] = useState(dealProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDiscountTier, setSelectedDiscountTier] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(60000);
  const [sortBy, setSortBy] = useState('savings');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState('');

  // Live Timer State (Ticking down hours, mins, secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modals & Sliders
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(0);

  const catalogRef = useRef(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    successToast(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  // Fetch discounted products from MongoDB API
  useEffect(() => {
    const fetchMongoDBDeals = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await productService.getAllProducts({ limit: 100 });
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mappedDbProducts = res.data
            .filter(p => p.discount > 0 || p.buyPrice < p.originalPrice || p.featured)
            .map(p => {
              const orig = p.originalPrice || Math.round((p.buyPrice || p.price || 3000) * 1.25);
              const disc = p.buyPrice || p.price || 2400;
              const savingsPct = Math.round(((orig - disc) / orig) * 100) || 15;

              return {
                id: p.id || p._id,
                name: p.title || p.name,
                category: p.category === 'Gaming Consoles' || p.category === 'Consoles' ? 'Console Savings' : p.category === 'Accessories' ? 'Gear & Controllers' : 'AAA Game Price Drops',
                brand: p.brand === 'Sony' ? 'PlayStation' : p.brand === 'Microsoft' ? 'Xbox' : (p.brand || 'PlayStation'),
                originalPrice: orig,
                discountedPrice: disc,
                savingsPct: savingsPct,
                rating: typeof p.rating === 'number' ? p.rating : (p.rating?.average || 4.8),
                reviewCount: p.reviews || (p.rating?.count || 140),
                inStock: p.stock > 0,
                stockLeft: Math.min(p.stock || 5, 8),
                totalStock: 25,
                badge: `${savingsPct}% OFF`,
                image: p.image || (Array.isArray(p.images) && p.images[0]) || p.thumbnail || 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
                description: p.description || p.shortDescription || 'Special price drop on premium gaming item.',
                specs: {
                  Condition: 'Brand New Factory Sealed',
                  Warranty: '1 Year Official Manufacturer Warranty',
                  Delivery: 'Fast 24-Hour Express Shipping',
                  Discount: `Save ₹${(orig - disc).toLocaleString('en-IN')}`
                }
              };
            });

          if (mappedDbProducts.length > 0) {
            const dbIds = new Set(mappedDbProducts.map(item => String(item.id)));
            const remainingStatic = dealProducts.filter(item => !dbIds.has(String(item.id)));
            setProductsList([...mappedDbProducts, ...remainingStatic]);
          }
        }
      } catch (err) {
        console.warn('[Deals] Could not load from MongoDB backend API. Using local fallback dataset:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchMongoDBDeals();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (selectedCategory !== 'all') {
        const catObj = dealCategories.find(c => c.id === selectedCategory);
        if (catObj && product.category.toLowerCase() !== catObj.name.toLowerCase() && !product.category.toLowerCase().includes(catObj.id)) {
          return false;
        }
      }
      if (selectedDiscountTier !== 'all') {
        const tierObj = discountTiers.find(t => t.id === selectedDiscountTier);
        if (tierObj && product.savingsPct < tierObj.minPct) {
          return false;
        }
      }
      if (selectedBrand !== 'All' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (product.discountedPrice > priceRange) {
        return false;
      }
      if (searchQuery.trim() && !product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'savings') return b.savingsPct - a.savingsPct;
      if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
      if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [productsList, selectedCategory, selectedDiscountTier, selectedBrand, inStockOnly, priceRange, sortBy, searchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDiscountTier, selectedBrand, inStockOnly, priceRange, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    addToCart({
      _id: product.id,
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.discountedPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      stock: product.inStock ? 10 : 0,
    }, 1);
  };

  const handleToggleWishlist = (product) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlistContext({
        id: product.id,
        title: product.name,
        price: product.discountedPrice,
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
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
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
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> Official Flash Sales & Price Drops
              </div>

              <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Epic Gaming Deals <br />
                <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  Save Up To 50% OFF
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Grab unmissable price cuts on PlayStation 5 bundles, Xbox Series consoles, Meta Quest VR, controllers, and top-rated AAA games. Verified authentic with brand warranty.
              </p>

              {/* Live Ticking Countdown Box */}
              <div className="p-4 rounded-2xl bg-gaming-black/80 border border-gaming-cyan/30 backdrop-blur-md inline-flex items-center gap-6 shadow-[0_0_25px_rgba(0,229,255,0.15)]">
                <div className="flex items-center gap-2 text-xs font-bold text-gaming-cyan uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Flash Sale Ends In:</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono font-extrabold text-lg">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-gaming-cyan/20 border border-gaming-cyan/40 text-gaming-cyan">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={scrollToCatalog}
                  className="h-12 px-7 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Tag className="w-4 h-4" />
                  Shop All Hot Deals
                </button>

                <a
                  href="#coupons"
                  className="h-12 px-6 rounded-xl bg-gaming-black/60 border border-gaming-border text-slate-200 font-semibold text-xs transition-all duration-300 flex items-center gap-2 hover:border-gaming-cyan/40 backdrop-blur-md"
                >
                  <Percent className="w-3.5 h-3.5 text-gaming-cyan" />
                  Claim Promo Vouchers
                </a>
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
                  alt="PS5 Spider-Man Deal" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-black via-transparent to-transparent opacity-60" />
                
                {/* Floating Glass Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-gaming-black/80 border border-gaming-cyan/30 backdrop-blur-md flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Deal Of The Day</span>
                    <p className="font-gaming text-sm font-bold text-white">PS5 Spider-Man 2 Bundle</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white font-bold text-xs shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    SAVE ₹10,000
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. ACTIVE PROMO COUPONS SECTION */}
      {/* ========================================================================= */}
      <section id="coupons" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-gaming-cyan tracking-widest uppercase">EXTRA SAVINGS</span>
              <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white mt-1">Claim Discount Vouchers</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Click to copy coupon code and apply at checkout for instant stackable discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCoupons.map((coupon, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border border-gaming-border bg-gradient-to-br ${coupon.bgGradient} p-5 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-gaming-cyan/40 transition-all`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gaming-cyan bg-gaming-cyan/10 px-2.5 py-1 rounded-full border border-gaming-cyan/30">
                      {coupon.discountText}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {coupon.expiry}
                    </span>
                  </div>
                  <h3 className="font-gaming text-lg font-bold text-white pt-1">{coupon.code}</h3>
                  <p className="text-xs text-slate-300">{coupon.description}</p>
                  <p className="text-[11px] text-slate-400">Min. Spend: ₹{coupon.minSpend.toLocaleString('en-IN')}</p>
                </div>

                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    copiedCoupon === coupon.code
                      ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-gaming-black/80 hover:bg-gaming-cyan hover:text-gaming-black border border-gaming-border text-slate-200'
                  }`}
                >
                  {copiedCoupon === coupon.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCoupon === coupon.code ? 'COPIED!' : `COPY CODE: ${coupon.code}`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. MAIN DEALS CATALOG SECTION & STICKY FILTER SIDEBAR */}
      {/* ========================================================================= */}
      <section ref={catalogRef} className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                Live Deals Catalog
              </h2>
              <p className="text-sm text-slate-400 mt-1">Filter by category, price drop percentage, and brand</p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {dealCategories.map((cat) => (
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

          {/* Search, Discount Tier Bar, Sort */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search PS5, Xbox, GTA V, Controllers..."
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

            {/* Discount Tier Filter Bar */}
            <div className="lg:col-span-4 flex items-center bg-gaming-black rounded-xl border border-gaming-border p-1 overflow-x-auto scrollbar-none">
              {discountTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedDiscountTier(tier.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedDiscountTier === tier.id
                      ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tier.label}
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
                <option value="savings">Sort: Highest Discount %</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden h-10 px-4 rounded-xl border border-gaming-border bg-gaming-card text-xs font-semibold text-slate-200 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-gaming-cyan" />
              </button>
            </div>
          </div>

          {/* Grid Layout (Pinned Sticky Sidebar + Deals Catalog) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            
            {/* Desktop Pinned Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gaming-border bg-gaming-card/50 p-6 backdrop-blur-xl space-y-6 scrollbar-thin scrollbar-thumb-gaming-cyan/30 pr-3">
              <div className="flex items-center justify-between border-b border-gaming-border pb-4">
                <span className="font-gaming text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gaming-cyan" /> Filter Deals
                </span>
                <button
                  onClick={() => {
                    setSelectedBrand('All');
                    setSelectedCategory('all');
                    setSelectedDiscountTier('all');
                    setInStockOnly(false);
                    setPriceRange(60000);
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-slate-400 hover:text-gaming-cyan cursor-pointer transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2.5 block">Brand / Platform</label>
                <div className="space-y-1.5">
                  {['All', 'PlayStation', 'Xbox', 'Meta', 'ASUS', 'SteelSeries'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedBrand === brand
                          ? 'bg-gaming-cyan/15 text-gaming-cyan border border-gaming-cyan/30 font-bold'
                          : 'text-slate-400 hover:bg-gaming-black hover:text-slate-200'
                      }`}
                    >
                      <span>{brand}</span>
                      {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-gaming-cyan" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Max Price</label>
                  <span className="text-xs font-bold text-gaming-cyan">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={60000}
                  step={1000}
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

              {/* Callout Badge */}
              <div className="p-3.5 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/20 text-xs space-y-1">
                <span className="font-bold text-gaming-cyan flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Genuine Guarantee
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  All discounted items are original sealed stock with 1 Year Warranty.
                </p>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="lg:col-span-9 flex flex-col justify-between">
              
              {isLoadingProducts ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-gaming-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading live gaming deals...</p>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="p-12 rounded-3xl border border-gaming-border bg-gaming-card/40 text-center space-y-4">
                  <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="font-gaming text-lg font-bold text-white">No Deals Match Your Filter</h3>
                  <p className="text-xs text-slate-400">Try lowering the discount percentage filter or resetting price range.</p>
                  <button
                    onClick={() => {
                      setSelectedBrand('All');
                      setSelectedCategory('all');
                      setSelectedDiscountTier('all');
                      setPriceRange(60000);
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
                    const wishlisted = isWishlisted(product.id);
                    const stockPct = Math.round((product.stockLeft / product.totalStock) * 100);

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
                          <Link to={`/product/${product.id}`} className="block w-full h-full">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>

                          {/* Top Savings Badge */}
                          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                              SAVE {product.savingsPct}%
                            </span>
                          </div>

                          {/* Wishlist Heart */}
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

                            <Link to={`/product/${product.id}`}>
                              <h3 className="font-gaming text-base font-bold text-white line-clamp-1 group-hover:text-gaming-cyan transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          {/* Limited Stock Urgency Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Only {product.stockLeft} Left at this price!
                              </span>
                              <span className="text-slate-500 font-medium">{stockPct}% Sold</span>
                            </div>
                            <div className="w-full bg-gaming-black rounded-full h-1.5 overflow-hidden border border-white/5">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${stockPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Price Row */}
                          <div className="flex items-baseline justify-between pt-1">
                            <div>
                              <span className="text-[11px] text-slate-500 line-through mr-1.5">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="font-gaming text-xl font-extrabold text-white">
                                ₹{product.discountedPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                              Save ₹{(product.originalPrice - product.discountedPrice).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={() => setQuickViewProduct(product)}
                              className="h-9 rounded-xl border border-gaming-border bg-gaming-black/60 hover:bg-gaming-card text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-gaming-cyan" />
                              <span>Specs</span>
                            </button>

                            <button
                              onClick={() => handleAddToCart(product)}
                              className="h-9 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Claim Deal</span>
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
      {/* 4. FAQS SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white">Deals & Price Cuts FAQs</h2>
            <p className="text-xs text-slate-400">Everything you need to know about GameHub limited-time promotions</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-3 pt-4">
            {dealFAQs.map((faq, idx) => (
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
      </section>


      {/* ========================================================================= */}
      {/* 5. QUICK VIEW MODAL */}
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

                  <div className="p-3 rounded-xl bg-gaming-black/60 border border-gaming-border space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Regular Price:</span>
                      <span className="line-through text-slate-500">₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-white">Deal Price:</span>
                      <span className="text-gaming-cyan font-gaming text-lg">₹{quickViewProduct.discountedPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold text-right">
                      You Save ₹{(quickViewProduct.originalPrice - quickViewProduct.discountedPrice).toLocaleString('en-IN')} ({quickViewProduct.savingsPct}% OFF)
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="p-4 rounded-xl bg-gaming-black/60 border border-gaming-border space-y-2 text-xs">
                <span className="font-bold text-white block mb-1">Key Specifications & Deal Highlights:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {Object.entries(quickViewProduct.specs || {}).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">{key}</span>
                      <span className="font-semibold text-white">{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 mt-3 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Deal to Cart
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
