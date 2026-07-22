import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Users,
  Database,
  Grid,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminStats() {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.success && res.data) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-center py-10 bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  const data = statsData || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    todaysOrders: 0,
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    registeredUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    lowStockItems: 0
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${(data.totalRevenue || 0).toLocaleString('en-IN')}`,
      tag: 'Lifetime',
      icon: DollarSign,
      color: 'text-gaming-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,229,255,0.15)] border-gaming-cyan/30',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${(data.monthlyRevenue || 0).toLocaleString('en-IN')}`,
      tag: 'This Month',
      icon: TrendingUp,
      color: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(52,211,153,0.15)] border-emerald-400/30',
    },
    {
      label: "Today's Orders",
      value: (data.todaysOrders || 0).toString(),
      tag: 'Today',
      icon: Clock,
      color: 'text-gaming-accent',
      glow: 'shadow-[0_0_15px_rgba(0,136,255,0.15)] border-gaming-accent/30',
    },
    {
      label: 'Total Orders',
      value: (data.totalOrders || 0).toString(),
      tag: 'All Time',
      icon: ShoppingBag,
      color: 'text-blue-400',
      glow: 'shadow-[0_0_15px_rgba(96,165,250,0.15)] border-blue-400/30',
    },
    {
      label: 'Pending Orders',
      value: (data.pendingOrders || 0).toString(),
      tag: 'Action Required',
      icon: Clock,
      color: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(251,191,36,0.15)] border-amber-400/30',
    },
    {
      label: 'Accepted Orders',
      value: (data.acceptedOrders || 0).toString(),
      tag: 'Processing',
      icon: CheckCircle,
      color: 'text-sky-400',
      glow: 'shadow-[0_0_15px_rgba(56,189,248,0.15)] border-sky-400/30',
    },
    {
      label: 'Shipped Orders',
      value: (data.shippedOrders || 0).toString(),
      tag: 'In Transit',
      icon: Truck,
      color: 'text-indigo-400',
      glow: 'shadow-[0_0_15px_rgba(129,140,248,0.15)] border-indigo-400/30',
    },
    {
      label: 'Delivered Orders',
      value: (data.deliveredOrders || 0).toString(),
      tag: 'Completed',
      icon: PackageCheck,
      color: 'text-green-400',
      glow: 'shadow-[0_0_15px_rgba(74,222,128,0.15)] border-green-400/30',
    },
    {
      label: 'Cancelled Orders',
      value: (data.cancelledOrders || 0).toString(),
      tag: 'Closed',
      icon: XCircle,
      color: 'text-rose-400',
      glow: 'shadow-[0_0_15px_rgba(251,113,133,0.15)] border-rose-400/30',
    },
    {
      label: 'Total Products',
      value: (data.totalProducts || 0).toString(),
      tag: 'Active Catalog',
      icon: Database,
      color: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(192,132,252,0.15)] border-purple-400/30',
    },
    {
      label: 'Total Categories',
      value: (data.totalCategories || 0).toString(),
      tag: 'Taxonomy',
      icon: Grid,
      color: 'text-pink-400',
      glow: 'shadow-[0_0_15px_rgba(244,114,182,0.15)] border-pink-400/30',
    },
    {
      label: 'Total Users',
      value: (data.registeredUsers || 0).toString(),
      tag: 'Customers',
      icon: Users,
      color: 'text-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.15)] border-cyan-400/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-left w-full">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border bg-gaming-card/45 p-4 flex flex-col justify-between space-y-3 transition-all duration-300 hover:scale-[1.02] ${stat.glow}`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-xl bg-gaming-black/50 ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gaming-black/60 text-slate-400 border border-gaming-border/40">
              {stat.tag}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
              {stat.label}
            </span>
            <span className="font-gaming text-sm sm:text-base font-extrabold text-white leading-tight block mt-0.5">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
