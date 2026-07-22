import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { successToast } from '../../utils/toast';
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Heart,
  User,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardOrders from '../../components/dashboard/DashboardOrders';
import DashboardRentals from '../../components/dashboard/DashboardRentals';
import DashboardProfile from '../../components/dashboard/DashboardProfile';
import DashboardSettings from '../../components/dashboard/DashboardSettings';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview'); // overview, orders, rentals, wishlist, profile, settings
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    successToast('Logged out successfully.');
    navigate('/login');
  };

  // Close mobile menu drawer on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'rentals', label: 'My Rentals', icon: Calendar },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const activeLabel = menuItems.find((item) => item.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="w-full bg-gaming-dark min-h-[85vh] text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-gaming-border mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle user dashboard panel sidebar menu"
              className="p-2 rounded-lg bg-gaming-card border border-gaming-border text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-gaming-cyan"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-gaming text-lg font-bold text-white tracking-wider">
              {activeLabel}
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg border border-gaming-border bg-gaming-card/45 hover:bg-red-500/5 text-slate-300 hover:text-red-500 transition-all cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-64 bg-gaming-card/30 border border-gaming-border rounded-3xl p-5 space-y-6 flex-shrink-0 sticky top-24 z-20">
            {/* User details header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-gaming-border/60">
              <div className="w-10 h-10 rounded-full border border-gaming-cyan bg-gaming-cyan/10 flex items-center justify-center font-gaming text-lg font-extrabold text-gaming-cyan">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs truncate max-w-[140px]">{user?.fullName}</h4>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Elite Gamer</span>
              </div>
            </div>

            {/* Menu Stack */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                        : 'text-slate-400 hover:bg-gaming-black/45 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 text-slate-500 hover:bg-red-500/5 hover:text-red-500 transition-all cursor-pointer border-t border-gaming-border/40 pt-4 mt-2"
              >
                <LogOut className="h-4.5 w-4.5" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* MOBILE SIDEBAR DRAWER OVERLAY */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Backdrop backdrop blur */}
              <div
                className="fixed inset-0 bg-gaming-dark/80 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Drawer Container */}
              <aside className="relative flex flex-col w-64 bg-gaming-card border-r border-gaming-border p-5 space-y-6 z-10">
                <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-gaming-cyan bg-gaming-cyan/10 flex items-center justify-center font-gaming text-base font-extrabold text-gaming-cyan">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-bold text-white text-xs truncate max-w-[120px]">{user?.fullName}</h4>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block">Elite Gamer</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded bg-gaming-black text-slate-400 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                            : 'text-slate-400 hover:bg-gaming-black/45 hover:text-white'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" />
                        {item.label}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 text-slate-500 hover:bg-red-500/5 hover:text-red-500 transition-all cursor-pointer border-t border-gaming-border/40 pt-4 mt-2"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Sign Out
                  </button>
                </nav>
              </aside>
            </div>
          )}

          {/* MAIN VIEW AREA (Right) */}
          <main className="flex-1 w-full space-y-8">
            
            {/* TAB: Overview (Dashboard) */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Greetings and point balances */}
                <div className="rounded-3xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gaming-cyan flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Status Center
                    </span>
                    <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                      Welcome, {user?.fullName || 'Gamer'}!
                    </h2>
                    <p className="text-xs text-slate-400 leading-normal max-w-md">
                      Your rentals status, reward points, and active settings are synchronized. Get ready to play.
                    </p>
                  </div>
                  
                  <div className="rounded-2xl bg-gaming-black/45 border border-gaming-border/60 p-4 min-w-[200px] text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Level Tier XP</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-gaming text-2xl font-extrabold text-white">2,450 XP</span>
                      <span className="text-[10px] text-gaming-cyan font-bold">Pro Level 3</span>
                    </div>
                  </div>
                </div>

                {/* Grid Stats */}
                <DashboardStats wishlistCount={wishlistItems.length} />

                {/* Split list shelf */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column: Recent Orders & Active Rentals */}
                  <div className="lg:col-span-2 space-y-8">
                    <DashboardOrders limit={3} />
                    <DashboardRentals />
                  </div>

                  {/* Right Column: Wishlist preview & profile info card */}
                  <div className="space-y-8">
                    {/* Wishlist widget */}
                    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4">
                      <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
                        <Heart className="h-4.5 w-4.5 text-red-500" />
                        Wishlist Preview
                      </h3>

                      {wishlistItems.length > 0 ? (
                        <div className="space-y-3.5">
                          {wishlistItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex gap-3.5 items-center pb-3 border-b border-gaming-border/30 last:border-b-0 last:pb-0">
                              <div className="w-11 h-11 rounded-lg overflow-hidden bg-gaming-black/20 flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-white text-xs truncate">{item.title}</h4>
                                <span className="text-[10px] text-gaming-cyan font-bold block mt-0.5">
                                  ${item.buyPrice?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                            </div>
                          ))}
                          <Link
                            to="/wishlist"
                            className="w-full h-10 rounded-xl border border-gaming-border hover:border-gaming-cyan/60 bg-gaming-black/20 hover:bg-gaming-cyan/5 text-slate-300 hover:text-gaming-cyan font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            View Wishlist
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-xs text-slate-500">Your wishlist is empty.</p>
                        </div>
                      )}
                    </div>

                    {/* Profile card summary info */}
                    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4">
                      <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
                        <User className="h-4.5 w-4.5 text-gaming-cyan" />
                        Profile Summary
                      </h3>

                      <div className="space-y-3 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Name</span>
                          <strong className="text-white font-semibold">{user?.fullName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Email</span>
                          <strong className="text-white font-semibold">{user?.email}</strong>
                        </div>
                        <div className="flex justify-between pb-3">
                          <span>Phone</span>
                          <strong className="text-white font-semibold">{user?.phone}</strong>
                        </div>
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="w-full h-10 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Orders */}
            {activeTab === 'orders' && <DashboardOrders />}

            {/* TAB: Rentals */}
            {activeTab === 'rentals' && <DashboardRentals />}

            {/* TAB: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-gaming-border/60">
                  <h3 className="font-gaming text-lg font-bold text-white tracking-wider flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500 fill-red-500/10" />
                    My Wishlist
                  </h3>
                  <Link to="/wishlist" className="text-xs font-bold text-gaming-cyan hover:underline">
                    Manage Full Page &rarr;
                  </Link>
                </div>

                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/45 overflow-hidden justify-between p-4 space-y-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gaming-black/25 flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-xs truncate max-w-[120px]">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.platform || 'Digital'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gaming-border/30 gap-2">
                          <span className="font-gaming text-xs font-extrabold text-gaming-cyan">${item.buyPrice?.toFixed(2)}</span>
                          <div className="flex items-center gap-3.5">
                            <button
                              onClick={() => {
                                addToCart({
                                  id: item.id,
                                  title: item.title,
                                  platform: item.platform || 'PS5',
                                  buyPrice: item.buyPrice,
                                  image: item.image,
                                  category: item.category || 'Games',
                                });
                                removeFromWishlist(item.id);
                                successToast(`Moved ${item.title} to shopping cart!`);
                              }}
                              className="h-8 px-3.5 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-[10px] transition-all duration-300 cursor-pointer"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border border-dashed border-gaming-border rounded-2xl">
                    <p className="text-slate-400 font-semibold">Your wishlist is empty.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Profile */}
            {activeTab === 'profile' && <DashboardProfile user={user} />}

            {/* TAB: Settings */}
            {activeTab === 'settings' && <DashboardSettings />}

          </main>

        </div>

      </div>
    </div>
  );
}
