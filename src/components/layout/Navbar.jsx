import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.webp';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { successToast } from '../../utils/toast';

export default function Navbar() {
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    await logout();
    successToast('Logged out successfully.');
    navigate('/');
  };

  // Close mobile drawer on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const links = [
    { name: 'Games', href: '/shop' },
    { name: 'Consoles', href: '/shop' },
    { name: 'Rent', href: '/shop' },
    { name: 'Buy', href: '/shop' },
    { name: 'Deals', href: '/shop' },
    { name: 'About', href: '#' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gaming-border bg-gaming-dark/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center gap-2">
            <img src={logo} alt="GameHub Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.2)]" />
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[15px] font-medium text-slate-300 transition-colors duration-200 hover:text-gaming-cyan relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gaming-cyan after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className={`h-4 w-4 transition-colors ${searchFocused ? 'text-gaming-cyan' : 'text-slate-400'}`} />
              </span>
              <input
                type="text"
                placeholder="Search titles or consoles..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 focus:ring-1 focus:ring-gaming-cyan/30 transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/wishlist" className="text-slate-300 hover:text-gaming-cyan transition-colors relative">
              <Heart className="h-5.5 w-5.5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gaming-cyan text-gaming-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="text-slate-300 hover:text-gaming-cyan transition-colors relative">
              <ShoppingBag className="h-5.5 w-5.5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gaming-cyan text-gaming-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="h-10 px-5 rounded-full border border-gaming-border hover:border-gaming-cyan/40 bg-gaming-black/20 hover:bg-gaming-cyan/5 text-xs font-semibold text-gaming-cyan flex items-center gap-2 transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-gaming-cyan/20 flex items-center justify-center font-bold text-[10px] text-gaming-cyan border border-gaming-cyan/30">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  {user?.fullName.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-gaming-cyan transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="h-10 px-6 rounded-full bg-gaming-accent text-white font-semibold text-sm hover:bg-gaming-cyan hover:text-gaming-black hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300 cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="text-slate-300 relative">
              <ShoppingBag className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gaming-cyan text-gaming-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle mobile navigation menu"
              className="text-slate-300 hover:text-gaming-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-gaming-cyan rounded"
            >
              {isOpen ? <X className="h-6.5 w-6.5" /> : <Menu className="h-6.5 w-6.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gaming-border bg-gaming-dark/95"
          >
            <div className="space-y-1 px-4 pb-6 pt-4">
              {/* Search in Mobile */}
              <div className="relative w-full mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search titles or consoles..."
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                />
              </div>

              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-base font-medium text-slate-300 hover:bg-gaming-card hover:text-gaming-cyan"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-gaming-border mt-4 pt-4 flex flex-col gap-4">
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 text-slate-300 hover:text-gaming-cyan"
                >
                  <Heart className="h-5 w-5" /> Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="bg-gaming-cyan text-gaming-black text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full h-11 rounded-full border border-gaming-border bg-gaming-black/45 text-gaming-cyan font-semibold flex items-center justify-center gap-2"
                      >
                        <User className="h-4.5 w-4.5" />
                        Dashboard ({user?.fullName.split(' ')[0]})
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="w-full h-11 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/login');
                        }}
                        className="w-full h-11 rounded-full border border-gaming-border bg-gaming-black/45 text-slate-300 font-semibold hover:text-gaming-cyan hover:border-gaming-cyan/40 transition-all cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/register');
                        }}
                        className="w-full h-11 rounded-full bg-gaming-accent text-white font-semibold hover:bg-gaming-cyan hover:text-gaming-black transition-all cursor-pointer"
                      >
                        Register
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
