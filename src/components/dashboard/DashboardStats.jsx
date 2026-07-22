import { ShoppingBag, Calendar, Heart, Award, TrendingUp, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardStats({ totalOrders = 12, activeRentals = 3, wishlistCount = 45 }) {
  const stats = [
    {
      label: 'TOTAL ORDERS',
      value: totalOrders,
      subtext: '+2 this month',
      subIcon: TrendingUp,
      subColor: 'text-emerald-400',
      borderColor: 'hover:border-cyan-500/40',
      icon: ShoppingBag,
      iconColor: 'text-cyan-400',
    },
    {
      label: 'ACTIVE RENTALS',
      value: activeRentals,
      subtext: 'Next due in 4 days',
      subIcon: Clock,
      subColor: 'text-slate-400',
      borderColor: 'hover:border-blue-500/40',
      icon: Calendar,
      iconColor: 'text-blue-400',
    },
    {
      label: 'WISHLIST',
      value: wishlistCount,
      subtext: '5 items on sale',
      subIcon: Tag,
      subColor: 'text-slate-400',
      borderColor: 'hover:border-pink-500/40',
      icon: Heart,
      iconColor: 'text-pink-400',
    },
    {
      label: 'LEVEL',
      value: 'Platinum',
      isProgress: true,
      subtext: 'Level 4 Elite',
      subIcon: Award,
      subColor: 'text-cyan-400',
      borderColor: 'hover:border-cyan-400/40',
      icon: Award,
      iconColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
          whileHover={{ y: -3 }}
          className={`rounded-2xl border border-slate-800/80 bg-[#0b0f1d]/80 backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${stat.borderColor}`}
        >
          <div className="space-y-3">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              {stat.label}
            </span>
            <div className="font-gaming text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              {stat.value}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs">
            {stat.isProgress ? (
              <div className="w-full space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>Progress to Diamond</span>
                  <span className="text-cyan-400 font-bold">82%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]"
                  />
                </div>
              </div>
            ) : (
              <>
                <stat.subIcon className={`h-3.5 w-3.5 ${stat.subColor}`} />
                <span className={`text-[11px] font-medium ${stat.subColor}`}>
                  {stat.subtext}
                </span>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
