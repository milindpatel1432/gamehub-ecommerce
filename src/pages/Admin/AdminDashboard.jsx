import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad,
  Monitor,
  ShoppingBag,
  Calendar,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Plus
} from 'lucide-react';

import AdminStats from '../../components/admin/AdminStats';
import AdminGames from '../../components/admin/AdminGames';
import AdminConsoles from '../../components/admin/AdminConsoles';
import AdminOrders from '../../components/admin/AdminOrders';
import AdminRentals from '../../components/admin/AdminRentals';
import AdminUsers from '../../components/admin/AdminUsers';
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import AdminSettings from '../../components/admin/AdminSettings';
import DashboardOrders from '../../components/dashboard/DashboardOrders';
import { successToast } from '../../utils/toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, games, consoles, orders, rentals, users, analytics, settings
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    successToast('Admin session logged out.');
    navigate('/');
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
    { id: 'games', label: 'Games', icon: Gamepad },
    { id: 'consoles', label: 'Consoles', icon: Monitor },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'rentals', label: 'Rentals', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
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
              aria-label="Toggle admin console dashboard panel sidebar menu"
              className="p-2 rounded-lg bg-gaming-card border border-gaming-border text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-gaming-cyan"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-gaming text-lg font-bold text-white tracking-wider">
              Admin: {activeLabel}
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg border border-gaming-border bg-gaming-card/45 text-slate-300 hover:text-red-500 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-64 bg-gaming-card/30 border border-gaming-border rounded-3xl p-5 space-y-6 flex-shrink-0">
            {/* User details header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-gaming-border/60">
              <div className="w-10 h-10 rounded-full border border-gaming-cyan bg-gaming-cyan/10 flex items-center justify-center font-gaming text-lg font-extrabold text-gaming-cyan">
                A
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs truncate max-w-[140px]">Platform Admin</h4>
                <span className="text-[10px] text-gaming-cyan uppercase tracking-widest font-semibold block">Full Access</span>
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
              {/* Backdrop blur */}
              <div
                className="fixed inset-0 bg-gaming-dark/80 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Drawer Container */}
              <aside className="relative flex flex-col w-64 bg-gaming-card border-r border-gaming-border p-5 space-y-6 z-10">
                <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-gaming-cyan bg-gaming-cyan/10 flex items-center justify-center font-gaming text-base font-extrabold text-gaming-cyan">
                      A
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-bold text-white text-xs truncate max-w-[120px]">Platform Admin</h4>
                      <span className="text-[9px] text-gaming-cyan uppercase tracking-widest font-semibold block">Full Access</span>
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
                {/* Greetings */}
                <div className="rounded-3xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gaming-cyan flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      HQ Operations
                    </span>
                    <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                      GameHub Admin Console
                    </h2>
                    <p className="text-xs text-slate-400 leading-normal max-w-md">
                      Analyze metrics, oversee transaction timelines, manage catalog configurations, and inspect accounts.
                    </p>
                  </div>
                </div>

                {/* Grid Stats */}
                <AdminStats />

                {/* Split list shelf */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column: Recent Orders */}
                  <div className="lg:col-span-2 space-y-8">
                    <DashboardOrders limit={3} />
                  </div>

                  {/* Right Column: Dummy Revenue Chart */}
                  <div className="space-y-8">
                    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4">
                      <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
                        Quick Revenue Flow
                      </h3>
                      
                      <div className="h-32 flex items-end gap-3 pb-2 border-b border-gaming-border/30">
                        <div className="flex-1 h-[40%] bg-gaming-cyan/40 rounded-t" />
                        <div className="flex-1 h-[60%] bg-gaming-cyan/40 rounded-t" />
                        <div className="flex-1 h-[50%] bg-gaming-cyan/40 rounded-t" />
                        <div className="flex-1 h-[80%] bg-gaming-cyan/40 rounded-t" />
                        <div className="flex-1 h-[95%] bg-gaming-cyan/40 rounded-t" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
                        Simulated Sales Growth Trend
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Games */}
            {activeTab === 'games' && <AdminGames />}

            {/* TAB: Consoles */}
            {activeTab === 'consoles' && <AdminConsoles />}

            {/* TAB: Orders */}
            {activeTab === 'orders' && <AdminOrders />}

            {/* TAB: Rentals */}
            {activeTab === 'rentals' && <AdminRentals />}

            {/* TAB: Users */}
            {activeTab === 'users' && <AdminUsers />}

            {/* TAB: Analytics */}
            {activeTab === 'analytics' && <AdminAnalytics />}

            {/* TAB: Settings */}
            {activeTab === 'settings' && <AdminSettings />}

          </main>

        </div>

      </div>
    </div>
  );
}
