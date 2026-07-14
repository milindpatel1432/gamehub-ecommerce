import { DollarSign, ShoppingBag, Calendar, Users, Database, AlertCircle } from 'lucide-react';

export default function AdminStats() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$24,850.50',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-gaming-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,229,255,0.15)]',
    },
    {
      label: 'Total Orders',
      value: '1,248',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'text-gaming-accent',
      glow: 'shadow-[0_0_15px_rgba(0,136,255,0.15)]',
    },
    {
      label: 'Active Rentals',
      value: '312',
      change: '+18.4%',
      icon: Calendar,
      color: 'text-orange-400',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    },
    {
      label: 'Registered Users',
      value: '840',
      change: '+5.7%',
      icon: Users,
      color: 'text-green-400',
      glow: 'shadow-[0_0_15px_rgba(74,222,128,0.15)]',
    },
    {
      label: 'Total Products',
      value: '180',
      change: 'Static',
      icon: Database,
      color: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(192,132,252,0.15)]',
    },
    {
      label: 'Low Stock Items',
      value: '3 Items',
      change: 'Attention Required',
      icon: AlertCircle,
      color: 'text-red-500',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/35',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border border-gaming-border bg-gaming-card/45 p-5 flex flex-col justify-between space-y-4 ${stat.glow}`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2.5 rounded-xl bg-gaming-black/40 ${stat.color}`}>
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              stat.change.startsWith('+')
                ? 'bg-green-500/10 text-green-400'
                : stat.change === 'Static'
                ? 'bg-slate-500/10 text-slate-400'
                : 'bg-red-500/10 text-red-500 animate-pulse'
            }`}>
              {stat.change}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
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
