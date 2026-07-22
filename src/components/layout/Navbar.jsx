import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.webp';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { successToast } from '../../utils/toast';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistItems } = useWishlist();
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef(null);

  // Scroll listener to activate sticky background color on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    successToast('Logged out successfully.');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Auto focus input when search is toggled open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut listener (Escape to close search/drawer, Ctrl+K to open search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const links = [
    { name: 'Games', href: '/shop' },
    { name: 'Consoles', href: '/shop' },
    { name: 'Rent', href: '/shop' },
    { name: 'Buy', href: '/shop' },
    { name: 'Deals', href: '/shop' },
    { name: 'About', href: '#' },
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full py-3 transition-all duration-300 ${
      scrolled
        ? 'bg-gaming-dark/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left: Brand Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center group">
            <div className="h-10 w-10 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.2)] group-hover:border-gaming-cyan transition-all">
              <img
                src={logo}
                alt="GameHub Logo"
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
              />
            </div>
          </Link>

          {/* Center: Floating Capsule Navigation Pill Bar (Matching Reference Layout) */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 rounded-full border border-gaming-cyan/20 bg-gaming-black/50 p-1.5 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.4)]">
              {links.map((link) => {
                const isActive = location.pathname === link.href && link.href !== '#';
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.4)] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions & Pill Button (Matching Reference CTA Style) */}
          <div className="hidden md:flex items-center gap-3">

            {/* Search Icon & Expandable Input */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ opacity: 0, width: 40 }}
                    animate={{ opacity: 1, width: 240 }}
                    exit={{ opacity: 0, width: 40 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    onSubmit={handleSearchSubmit}
                    className="relative flex items-center"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-8 rounded-full bg-gaming-black/90 border border-gaming-cyan/50 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gaming-cyan/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                    />
                    <Search className="absolute left-3 h-3.5 w-3.5 text-gaming-cyan" />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-2.5 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    title="Search (Ctrl + K)"
                    className="h-9 w-9 rounded-full border border-gaming-border hover:border-gaming-cyan/40 bg-gaming-black/40 hover:bg-gaming-card flex items-center justify-center text-slate-300 hover:text-gaming-cyan transition-all cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative h-9 w-9 rounded-full border border-gaming-border hover:border-gaming-cyan/40 bg-gaming-black/40 hover:bg-gaming-card flex items-center justify-center text-slate-300 hover:text-gaming-cyan transition-all"
              title="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gaming-cyan text-gaming-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative h-9 w-9 rounded-full border border-gaming-border hover:border-gaming-cyan/40 bg-gaming-black/40 hover:bg-gaming-card flex items-center justify-center text-slate-300 hover:text-gaming-cyan transition-all"
              title="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gaming-cyan text-gaming-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* Pill CTA Button (Matching Reference Layout "Contact ->") */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/dashboard"
                  className="h-9 px-4 rounded-full border border-gaming-cyan/40 bg-gaming-cyan/10 hover:bg-gaming-cyan/20 text-xs font-semibold text-gaming-cyan flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                >
                  <div className="w-4 h-4 rounded-full bg-gaming-cyan text-gaming-black flex items-center justify-center font-bold text-[9px]">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.fullName.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold tracking-wider text-slate-400 hover:text-red-400 transition-colors cursor-pointer px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="h-9 px-4 rounded-full text-xs font-semibold text-slate-300 hover:text-gaming-cyan hover:bg-white/5 border border-gaming-border/60 hover:border-gaming-cyan/30 transition-all flex items-center justify-center"
                >
                  Login
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="h-9 px-5 rounded-full bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-xs tracking-wide hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all duration-300 cursor-pointer flex items-center gap-2 group"
                >
                  <span>Register</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-slate-300 p-2 cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link to="/cart" className="text-slate-300 relative p-2">
              <ShoppingBag className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute top-0 right-0 bg-gaming-cyan text-gaming-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-gaming-cyan p-2 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Search Input Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-4 pb-3 pt-2 border-t border-gaming-border bg-gaming-dark/95"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search games, consoles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-9 rounded-full bg-gaming-black border border-gaming-cyan/50 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gaming-cyan/40"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gaming-cyan" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-2.5 text-slate-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gaming-border bg-gaming-dark/95 backdrop-blur-xl"
          >
            <div className="space-y-1 px-4 pb-6 pt-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-gaming-card hover:text-gaming-cyan transition-all"
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gaming-border mt-3 pt-3 flex flex-col gap-2.5">
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2 rounded-xl bg-gaming-card/40 text-slate-300 hover:text-gaming-cyan text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Wishlist
                  </span>
                  {wishlistItems.length > 0 && (
                    <span className="bg-gaming-cyan text-gaming-black text-[9px] font-bold rounded-full px-2 py-0.5">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full h-10 rounded-full border border-gaming-cyan/40 bg-gaming-cyan/10 text-gaming-cyan text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Dashboard ({user?.fullName.split(' ')[0]})
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full h-10 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/login');
                      }}
                      className="w-full h-10 rounded-full border border-gaming-border bg-gaming-card text-slate-300 text-xs font-semibold hover:text-gaming-cyan transition-all cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/register');
                      }}
                      className="w-full h-10 rounded-full bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Register</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
