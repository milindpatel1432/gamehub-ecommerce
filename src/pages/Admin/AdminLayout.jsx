import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad,
  FolderOpen,
  ShoppingBag,
  Calendar,
  Users,
  MessageSquare,
  Ticket,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { successToast } from '../../utils/toast';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    successToast('Admin session logged out.');
    navigate('/login');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Gamepad },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/rentals', label: 'Rentals', icon: Calendar },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { path: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const currentLabel = menuItems.find((item) => item.path === location.pathname)?.label || 'Console';

  return (
    <div className="w-full bg-gaming-dark min-h-screen text-left flex flex-col lg:flex-row">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-gaming-card/20 border-r border-gaming-border p-6 flex-shrink-0 justify-between overflow-y-auto z-30">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gaming-cyan to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <span className="font-gaming text-lg font-black text-gaming-black">G</span>
            </div>
            <span className="font-gaming text-lg font-black text-white tracking-widest uppercase">
              Game<span className="text-gaming-cyan">Hub</span>
            </span>
          </div>

          {/* Nav Stack */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                      : 'text-slate-400 hover:bg-gaming-black/45 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <button
          onClick={handleLogout}
          className="w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 text-slate-500 hover:bg-red-500/5 hover:text-red-500 transition-all cursor-pointer border-t border-gaming-border/40 pt-4 mt-8"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign Out
        </button>
      </aside>

      {/* MOBILE DRAWER MENUBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-gaming-dark/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-gaming-card border-r border-gaming-border p-6 justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
                <span className="font-gaming text-base font-extrabold text-white tracking-widest">
                  Game<span className="text-gaming-cyan">Hub</span> Admin
                </span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded bg-gaming-black text-slate-400 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 transition-all ${
                        isActive
                          ? 'bg-gaming-cyan text-gaming-black'
                          : 'text-slate-400 hover:bg-gaming-black/45 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full h-11 px-4 rounded-xl text-xs font-bold tracking-wider flex items-center gap-3.5 text-slate-500 hover:bg-red-500/5 hover:text-red-500 transition-all cursor-pointer border-t border-gaming-border/40 pt-4 mt-8"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          </aside>
        </div>
      )}

      {/* RIGHT SIDE VIEW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-gaming-border bg-gaming-card/20 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-gaming-card border border-gaming-border text-white cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-gaming text-lg font-black text-white tracking-wider uppercase hidden sm:block">
              {currentLabel}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl border border-gaming-border bg-gaming-black/40 hover:bg-gaming-black/85 text-slate-400 hover:text-white transition-all cursor-pointer">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gaming-cyan shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl border border-gaming-border bg-gaming-black/40 hover:bg-gaming-black/85 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-gaming-cyan to-blue-500 flex items-center justify-center font-gaming text-xs font-black text-gaming-black shadow-md">
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
                </div>
                <div className="text-left hidden md:block">
                  <h4 className="text-[10px] font-bold text-white leading-none truncate max-w-[100px]">
                    {user?.fullName || 'Platform Admin'}
                  </h4>
                  <span className="text-[8px] text-gaming-cyan uppercase tracking-widest font-extrabold leading-none mt-1 block">
                    Admin
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gaming-border bg-gaming-card shadow-2xl p-2 z-50">
                  <div className="px-3.5 py-2.5 border-b border-gaming-border/60">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Logged in as</p>
                    <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{user?.email || 'admin@gamehub.com'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left rounded-lg px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/5 hover:text-red-500 transition-all cursor-pointer flex items-center gap-2 mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
