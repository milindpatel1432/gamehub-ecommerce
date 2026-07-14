import { ShoppingBag, Calendar, Heart, Trophy } from 'lucide-react';

export default function DashboardStats({ totalOrders = 3, activeRentals = 1, wishlistCount = 0 }) {
  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-gaming-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,229,255,0.15)]',
    },
    {
      label: 'Active Rentals',
      value: activeRentals,
      icon: Calendar,
      color: 'text-orange-400',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    },
    {
      label: 'Wishlist Items',
      value: wishlistCount,
      icon: Heart,
      color: 'text-red-500',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    },
    {
      label: 'Loyalty Points',
      value: '2,450 XP',
      icon: Trophy,
      color: 'text-yellow-500',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border border-gaming-border bg-gaming-card/35 p-5 flex items-center gap-4 ${stat.glow}`}
        >
          <div className={`p-3 rounded-xl bg-gaming-black/40 ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              {stat.label}
            </span>
            <span className="font-gaming text-base sm:text-lg font-extrabold text-white">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
