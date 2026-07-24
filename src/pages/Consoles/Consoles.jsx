import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ShoppingBag, Heart, Eye, Check, ArrowRight, Star, 
  ShieldCheck, Zap, Lock, RotateCcw, Headphones, Award, ChevronDown, 
  SlidersHorizontal, X, Layers, Cpu, HardDrive, Gamepad2, Sparkles, Scale 
} from 'lucide-react';
import { 
  consoleBrands, 
  consoleProducts, 
  consoleComparisonMatrix, 
  exclusiveBundles, 
  whyChooseGameHub, 
  consoleReviews, 
  consoleFAQs 
} from '../../data/consolesData';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { successToast, infoToast } from '../../utils/toast';

const ICON_MAP = {
  ShieldCheck: ShieldCheck,
  Zap: Zap,
  Lock: Lock,
  RotateCcw: RotateCcw,
  Headphones: Headphones,
  Award: Award,
};

export default function Consoles() {
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist: addToWishlistContext, removeFromWishlist } = useWishlist();

  const handleToggleWishlist = (product) => {
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

  // State Management
  const [productsList, setProductsList] = useState(consoleProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedEdition, setSelectedEdition] = useState('All');
  const [selectedStorage, setSelectedStorage] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(80000);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from MongoDB API
  useEffect(() => {
    const fetchMongoDBProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await productService.getAllProducts({ limit: 100 });
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          // Filter for Gaming Consoles or console brands
          const consoleDbItems = res.data.filter(
            (p) =>
              p.category === 'Gaming Consoles' ||
              p.category === 'Consoles' ||
              ['Sony', 'Microsoft', 'Nintendo', 'Valve', 'ASUS', 'PlayStation', 'Xbox', 'Lenovo'].includes(p.brand)
          );

          if (consoleDbItems.length > 0) {
            const mappedDbProducts = consoleDbItems.map((p) => ({
              id: p.id || p._id,
              name: p.title || p.name,
              brand: p.brand === 'Sony' ? 'PlayStation' : p.brand === 'Microsoft' ? 'Xbox' : p.brand === 'Valve' ? 'Steam Deck' : p.brand === 'ASUS' ? 'ASUS ROG Ally' : (p.brand || 'PlayStation'),
              edition: p.title?.includes('Digital') ? 'Digital' : p.title?.includes('Limited') ? 'Limited Edition' : 'Disc',
              storage: p.title?.includes('2TB') ? '2TB' : p.title?.includes('1TB') ? '1TB' : p.title?.includes('512GB') ? '512GB' : p.title?.includes('64GB') ? '64GB' : '1TB',
              color: 'Standard Edition',
              condition: p.condition === 'Pre-owned' ? 'Refurbished' : 'New',
              originalPrice: p.originalPrice || Math.round(p.buyPrice * 1.15),
              discountedPrice: p.buyPrice || p.price,
              rating: typeof p.rating === 'number' ? p.rating : (p.rating?.average || 4.8),
              reviewCount: p.reviews || (p.rating?.count || 150),
              inStock: p.stock > 0,
              badge: p.featured ? 'FEATURED' : 'POPULAR',
              image: p.image || p.thumbnail || 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
              description: p.description || p.shortDescription,
              specs: {
                CPU: 'Custom High-Performance Processor',
                GPU: 'Ray-Tracing Next-Gen Graphics',
                RAM: '16GB High Speed GDDR6',
                Storage: 'Custom Ultra-Fast SSD',
                Output: '4K HDR at 120 FPS',
              },
            }));

            // Combine backend MongoDB items with any unique static items
            const dbIds = new Set(mappedDbProducts.map(item => item.id));
            const remainingStatic = consoleProducts.filter(item => !dbIds.has(item.id));
            setProductsList([...mappedDbProducts, ...remainingStatic]);
          }
        }
      } catch (err) {
        console.warn('[Consoles] Could not load from MongoDB backend API. Using local console data:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchMongoDBProducts();
  }, []);
  
  // Modals & Panels
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareItems, setCompareItems] = useState([
    consoleProducts[0],
    consoleProducts[2],
    consoleProducts[3]
  ]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const catalogRef = useRef(null);
  const compareRef = useRef(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCompare = () => {
    compareRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (selectedBrand !== 'All' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (selectedEdition !== 'All' && product.edition !== selectedEdition) {
        return false;
      }
      if (selectedStorage !== 'All' && product.storage !== selectedStorage) {
        return false;
      }
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) {
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
      if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
      if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return String(b.id).localeCompare(String(a.id));
      return 0; // Default featured
    });
  }, [productsList, selectedBrand, selectedEdition, selectedStorage, selectedCondition, inStockOnly, priceRange, sortBy, searchQuery]);

  const handleAddToCart = (product) => {
    addToCart({
      _id: product.id,
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.discountedPrice,
      image: product.image,
      stock: product.inStock ? 10 : 0,
    }, 1);
  };

  const handleToggleCompare = (product) => {
    if (compareItems.some(item => item.id === product.id)) {
      setCompareItems(compareItems.filter(item => item.id !== product.id));
      infoToast(`Removed ${product.name} from comparison.`);
    } else {
      if (compareItems.length >= 3) {
        infoToast('You can compare a maximum of 3 consoles at a time.');
        return;
      }
      setCompareItems([...compareItems, product]);
      successToast(`Added ${product.name} to comparison!`);
    }
  };

  const handleSubscribeNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    successToast('Subscribed to Console Launch drops successfully!');
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-slate-100 pb-20 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-gaming-border overflow-hidden bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        {/* Futuristic Background Lights & Glowing Elements */}
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
                <Sparkles className="w-3.5 h-3.5" /> Official Next-Gen Marketplace
              </div>

              <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Next-Generation <br />
                <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  Gaming Starts Here
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Explore the latest PlayStation, Xbox, Nintendo, and handheld gaming consoles with official warranty, exclusive bundles, and fast delivery.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={scrollToCatalog}
                  className="h-13 px-8 rounded-full bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all duration-300 flex items-center gap-3 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Consoles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={scrollToCompare}
                  className="h-13 px-8 rounded-full border border-gaming-cyan/40 bg-gaming-black/60 hover:bg-gaming-card text-white font-semibold text-sm hover:border-gaming-cyan hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-gaming-cyan" />
                  <span>Compare Consoles</span>
                </button>
              </div>

              {/* Badges Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gaming-border/60">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">100%</p>
                  <p className="text-xs text-slate-400">Genuine Sealed Units</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gaming-cyan">1 Year</p>
                  <p className="text-xs text-slate-400">Official Brand Warranty</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">24 Hours</p>
                  <p className="text-xs text-slate-400">Express Delivery</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Image Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-gaming-cyan/30 bg-gaming-card/40 p-4 backdrop-blur-xl shadow-[0_0_50px_rgba(0,229,255,0.25)] group">
                <img 
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80" 
                  alt="PS5 Pro Console"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-black via-transparent to-transparent opacity-60" />
                
                {/* Floating Glass Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-gaming-black/80 border border-gaming-cyan/30 backdrop-blur-md flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gaming-cyan font-bold">Featured Console</span>
                    <p className="font-gaming text-sm font-bold text-white">PS5 Pro 2TB Digital Edition</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gaming-cyan text-gaming-black font-bold text-xs">
                    In Stock
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. SHOP BY BRAND */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Shop Consoles By Brand
            </h2>
            <p className="text-sm text-slate-400 mt-2">Select your favorite ecosystem to explore available inventory</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {consoleBrands.map((brand, idx) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => {
                  setSelectedBrand(brand.name);
                  scrollToCatalog();
                }}
                className={`glass-card relative rounded-2xl border border-gaming-border bg-gradient-to-br ${brand.color} p-6 cursor-pointer hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden ${brand.glowColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      {brand.count} Models
                    </span>
                    <h3 className="font-gaming text-xl font-bold text-white group-hover:text-gaming-cyan transition-colors">
                      {brand.name}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gaming-black/60 border border-white/10 p-2 overflow-hidden flex items-center justify-center">
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>

                <div className="relative h-36 w-full my-4 rounded-xl overflow-hidden bg-gaming-black/30">
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {brand.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gaming-cyan group-hover:translate-x-1 transition-transform">
                  <span>Browse {brand.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. FEATURED CONSOLES & FILTERS */}
      {/* ========================================================================= */}
      <section ref={catalogRef} className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                Consoles Catalog
              </h2>
              <p className="text-sm text-slate-400 mt-1">Browse, filter, and compare next-gen gaming hardware</p>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden h-10 px-4 rounded-xl border border-gaming-border bg-gaming-card text-xs font-semibold text-slate-200 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-gaming-cyan" />
                <span>Filters</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-4 pr-8 rounded-xl border border-gaming-border bg-gaming-black text-xs font-semibold text-slate-200 focus:outline-none focus:border-gaming-cyan cursor-pointer"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Releases</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Desktop Sticky Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="sticky top-24 rounded-2xl border border-gaming-border bg-gaming-card/50 p-6 backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-gaming-border pb-4">
                  <span className="font-gaming text-sm font-bold text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gaming-cyan" /> Filters
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBrand('All');
                      setSelectedEdition('All');
                      setSelectedStorage('All');
                      setSelectedCondition('All');
                      setInStockOnly(false);
                      setPriceRange(80000);
                      setSearchQuery('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-gaming-cyan cursor-pointer transition-colors"
                  >
                    Reset All
                  </button>
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Model name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gaming-cyan"
                    />
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Brand Ecosystem</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
                  >
                    <option value="All">All Brands</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="Steam Deck">Steam Deck</option>
                    <option value="ASUS ROG Ally">ASUS ROG Ally</option>
                    <option value="Retro Consoles">Retro Consoles</option>
                  </select>
                </div>

                {/* Max Price Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Max Price</span>
                    <span className="text-gaming-cyan font-bold">₹{priceRange.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="80000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-gaming-cyan cursor-pointer"
                  />
                </div>

                {/* Edition */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Console Edition</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Digital', 'Disc', 'Limited Edition'].map((ed) => (
                      <button
                        key={ed}
                        onClick={() => setSelectedEdition(ed)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedEdition === ed
                            ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                            : 'bg-gaming-black border border-gaming-border text-slate-300 hover:border-gaming-cyan/40'
                        }`}
                      >
                        {ed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Capacity */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Storage Capacity</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', '64GB', '512GB', '1TB', '2TB'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStorage(st)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedStorage === st
                            ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                            : 'bg-gaming-black border border-gaming-border text-slate-300 hover:border-gaming-cyan/40'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock Switch */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-slate-300">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-gaming-cyan cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="lg:col-span-9">
              {filteredProducts.length === 0 ? (
                <div className="p-12 rounded-3xl border border-gaming-border bg-gaming-card/40 text-center space-y-4">
                  <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="font-gaming text-lg font-bold text-white">No Consoles Found</h3>
                  <p className="text-xs text-slate-400">Try adjusting your filter options or price slider.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const wishlisted = isWishlisted(product.id);
                    const isCompared = compareItems.some(i => i.id === product.id);

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/60 p-5 hover:border-gaming-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 relative group"
                      >
                        {/* Image Container */}
                        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gaming-black/60 mb-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-gaming-cyan/90 text-gaming-black text-[9px] font-extrabold uppercase">
                              {product.badge}
                            </span>
                          </div>

                          {/* Top Wishlist Heart Action */}
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
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

                          {/* Specs Pills */}
                          <div className="flex items-center gap-2 text-[10px] text-slate-300 pt-2 border-t border-gaming-border/40">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{product.storage}</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{product.edition}</span>
                          </div>

                          {/* Price Row */}
                          <div className="flex items-baseline justify-between pt-2">
                            <div>
                              <span className="text-[10px] text-slate-500 line-through mr-1.5">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="font-gaming text-lg font-bold text-white">
                                ₹{product.discountedPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                              In Stock
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
                              className="h-9 rounded-xl bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add Cart</span>
                            </button>
                          </div>

                          {/* Compare Toggle */}
                          <button
                            onClick={() => handleToggleCompare(product)}
                            className={`w-full py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 rounded-lg border transition-all cursor-pointer ${
                              isCompared
                                ? 'bg-gaming-cyan/10 border-gaming-cyan text-gaming-cyan'
                                : 'border-gaming-border/60 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Scale className="w-3 h-3" />
                            <span>{isCompared ? 'Compared (Added)' : 'Compare Spec'}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. COMPARE CONSOLES SIDE-BY-SIDE BANNER */}
      {/* ========================================================================= */}
      <section ref={compareRef} className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/60 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold uppercase">
              Head-to-Head Comparison
            </span>
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white">
              Not Sure Which Console Fits Your Play Style?
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Compare power, storage, target resolutions, and pricing side-by-side to make the right gaming investment.
            </p>
          </div>

          {/* Side by side table matrix */}
          <div className="overflow-x-auto rounded-3xl border border-gaming-border bg-gaming-card/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gaming-border bg-gaming-black/80">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Console Spec</th>
                  <th className="p-5 font-gaming text-base font-bold text-gaming-cyan">PlayStation 5</th>
                  <th className="p-5 font-gaming text-base font-bold text-emerald-400">Xbox Series X</th>
                  <th className="p-5 font-gaming text-base font-bold text-pink-400">Nintendo Switch OLED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gaming-border/60 text-xs">
                {consoleComparisonMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-5 font-semibold text-slate-300 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-gaming-cyan" /> {row.feature}
                    </td>
                    <td className="p-5 text-slate-200">{row.ps5}</td>
                    <td className="p-5 text-slate-200">{row.xbox}</td>
                    <td className="p-5 text-slate-200">{row.nintendo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. EXCLUSIVE GAMING BUNDLES */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase text-gaming-cyan tracking-wider">Unbeatable Value</span>
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Exclusive Gaming Bundles
            </h2>
            <p className="text-sm text-slate-400 mt-2">Get consoles packaged with extra controllers, top AAA games, & headsets</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {exclusiveBundles.map((bundle) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card flex flex-col justify-between rounded-3xl border border-gaming-border bg-gaming-card/60 p-6 relative group hover:border-gaming-cyan/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.2)] transition-all duration-300"
              >
                <div>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gaming-black/60 mb-6">
                    <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gaming-cyan text-gaming-black text-[10px] font-black uppercase">
                      {bundle.badge}
                    </span>
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-gaming-black text-[10px] font-black uppercase">
                      {bundle.savings}
                    </span>
                  </div>

                  <h3 className="font-gaming text-lg font-bold text-white mb-2">{bundle.title}</h3>
                  <p className="text-xs font-semibold text-gaming-cyan mb-4">{bundle.console}</p>

                  <div className="space-y-2 border-t border-b border-gaming-border/60 py-4 mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Includes Everything Below:</span>
                    {bundle.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-gaming-cyan flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-xs text-slate-500 line-through mr-2">₹{bundle.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="font-gaming text-xl font-bold text-white">₹{bundle.bundlePrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        _id: bundle.id,
                        id: bundle.id,
                        title: bundle.title,
                        name: bundle.title,
                        price: bundle.bundlePrice,
                        image: bundle.image,
                        stock: 5,
                      }, 1);
                    }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Claim Bundle Deal
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. WHY BUY FROM GAMEHUB */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Why Buy Consoles From GameHub?
            </h2>
            <p className="text-sm text-slate-400 mt-2">Your trust, safety, and authentic gaming experience are our top priorities.</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseGameHub.map((feature, idx) => {
              const IconComp = ICON_MAP[feature.icon] || ShieldCheck;

              return (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl border border-gaming-border bg-gaming-card/40 hover:border-gaming-cyan/40 transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/30 flex items-center justify-center text-gaming-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-gaming text-base font-bold text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. CUSTOMER REVIEWS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase text-gaming-cyan tracking-wider">Verified Gamer Feedback</span>
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white mt-1">
              What Gamers Say About Us
            </h2>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consoleReviews.map((rev) => (
              <div key={rev.id} className="glass-card p-6 rounded-3xl border border-gaming-border bg-gaming-card/50 space-y-4 relative">
                <div className="flex items-center gap-3">
                  <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover border border-gaming-cyan/50" />
                  <div>
                    <h4 className="font-gaming text-sm font-bold text-white">{rev.name}</h4>
                    <span className="text-[10px] text-gaming-cyan font-semibold">{rev.purchased}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.review}"</p>
                <span className="text-[10px] text-slate-500 block text-right">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white">
              Console Buying FAQs
            </h2>
            <p className="text-sm text-slate-400 mt-2">Got questions regarding warranties, shipping, or returns? We have answers.</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-4">
            {consoleFAQs.map((faq, idx) => {
              const isOpen = expandedFAQ === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gaming-border bg-gaming-card/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFAQ(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-gaming text-sm font-bold text-white hover:text-gaming-cyan cursor-pointer transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-gaming-cyan transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-gaming-border/40 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 9. NEWSLETTER SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gaming-cyan/40 bg-gradient-to-r from-gaming-black via-gaming-card to-gaming-black p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.15)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gaming-cyan/10 rounded-full blur-3xl pointer-events-none" />
          
          <span className="px-3.5 py-1 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold uppercase">
            Stay Ahead Of The Game
          </span>

          <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Never Miss The Next Console Drop
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
            Subscribe to receive instant updates on PS5 Pro stock alerts, Xbox Game Pass bundles, and limited-time discount drops.
          </p>

          <form onSubmit={handleSubscribeNewsletter} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full sm:w-80 h-12 px-4 rounded-full bg-gaming-black border border-gaming-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gaming-cyan shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all cursor-pointer flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* QUICK VIEW SPECS MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-3xl border border-gaming-cyan/40 bg-gaming-dark p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.25)]"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="h-56 w-full rounded-2xl overflow-hidden bg-gaming-black">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gaming-cyan">{quickViewProduct.brand} • {quickViewProduct.badge}</span>
                  <h3 className="font-gaming text-xl font-bold text-white">{quickViewProduct.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{quickViewProduct.description}</p>
                  <div className="pt-2">
                    <span className="font-gaming text-2xl font-bold text-white">₹{quickViewProduct.discountedPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Hardware Specs Grid */}
              <div className="border-t border-gaming-border pt-4">
                <h4 className="font-gaming text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gaming-cyan" /> Detailed Specs
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(quickViewProduct.specs).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-gaming-black/60 border border-white/5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">{key}</span>
                      <span className="text-slate-200 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ========================================================================= */}
      {/* MOBILE FILTER DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm lg:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-xs h-full bg-gaming-dark border-l border-gaming-border p-6 space-y-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gaming-border pb-4">
                <span className="font-gaming text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gaming-cyan" /> Filters
                </span>
                <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Brand Ecosystem</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-slate-200"
                >
                  <option value="All">All Brands</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Xbox">Xbox</option>
                  <option value="Nintendo">Nintendo</option>
                  <option value="Steam Deck">Steam Deck</option>
                  <option value="ASUS ROG Ally">ASUS ROG Ally</option>
                  <option value="Retro Consoles">Retro Consoles</option>
                </select>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Max Price</span>
                  <span className="text-gaming-cyan font-bold">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="80000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gaming-cyan"
                />
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-11 rounded-xl bg-gaming-cyan text-gaming-black font-bold text-xs uppercase cursor-pointer"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
