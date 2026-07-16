import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Calendar, Sparkles } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();
        if (res.success && res.data) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.error(err);
        errorToast('Failed to retrieve catalog analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  const chartData = analyticsData?.chartData || [
    { label: 'Jan', revenue: 0, orders: 0, rentals: 0 },
    { label: 'Feb', revenue: 0, orders: 0, rentals: 0 },
    { label: 'Mar', revenue: 0, orders: 0, rentals: 0 },
    { label: 'Apr', revenue: 0, orders: 0, rentals: 0 },
    { label: 'May', revenue: 0, orders: 0, rentals: 0 },
    { label: 'Jun', revenue: 0, orders: 0, rentals: 0 },
  ];

  const popular = analyticsData?.popular || [];

  // Determine scaling helpers for heights (percentages based on max values)
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...chartData.map((d) => d.orders), 1);
  const maxRentals = Math.max(...chartData.map((d) => d.rentals), 1);

  return (
    <div className="space-y-8 text-left">
      
      {/* Charts split grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Revenue Trends */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6">
          <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-gaming-cyan" />
            Revenue Growth
          </h3>
          
          <div className="h-44 flex items-end gap-3.5 pb-2 border-b border-gaming-border/30">
            {chartData.map((d, idx) => {
              const pct = (d.revenue / maxRevenue) * 90 + 10; // minimum height 10%
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full bg-gaming-cyan/35 border border-gaming-cyan rounded-t group-hover:bg-gaming-cyan/65 transition-all duration-300 relative shadow-[0_0_10px_rgba(0,229,255,0.1)] cursor-pointer"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gaming-card border border-gaming-border text-[9px] text-white px-1.5 py-0.5 rounded transition-all font-bold whitespace-nowrap z-10">
                      ${d.revenue}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Orders Trends */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6">
          <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-gaming-accent" />
            Orders Monthly
          </h3>
          
          <div className="h-44 flex items-end gap-3.5 pb-2 border-b border-gaming-border/30">
            {chartData.map((d, idx) => {
              const pct = (d.orders / maxOrders) * 90 + 10;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full bg-gaming-accent/35 border border-gaming-accent rounded-t group-hover:bg-gaming-accent/65 transition-all duration-300 relative shadow-[0_0_10px_rgba(0,136,255,0.1)] cursor-pointer"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gaming-card border border-gaming-border text-[9px] text-white px-1.5 py-0.5 rounded transition-all font-bold whitespace-nowrap z-10">
                      {d.orders} orders
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Rentals Trends */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6">
          <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-orange-400" />
            Rentals Monthly
          </h3>
          
          <div className="h-44 flex items-end gap-3.5 pb-2 border-b border-gaming-border/30">
            {chartData.map((d, idx) => {
              const pct = (d.rentals / maxRentals) * 90 + 10;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full bg-orange-400/30 border border-orange-400 rounded-t group-hover:bg-orange-400/60 transition-all duration-300 relative shadow-[0_0_10px_rgba(249,115,22,0.1)] cursor-pointer"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gaming-card border border-gaming-border text-[9px] text-white px-1.5 py-0.5 rounded transition-all font-bold whitespace-nowrap z-10">
                      {d.rentals} rentals
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row: Popular products table */}
      <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2 pb-2 border-b border-gaming-border/60">
          <Sparkles className="h-4.5 w-4.5 text-yellow-500" />
          Popular Gear & Products
        </h3>

        {popular.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No data on hot products/sales yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left text-slate-300">
              <thead>
                <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
                  <th className="py-3 px-2">Gear model</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Purchased Count</th>
                  <th className="py-3 px-2">Rental Count</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gaming-border/30">
                {popular.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gaming-black/20 transition-colors">
                    <td className="py-3 px-2 font-bold text-white">{item.title}</td>
                    <td className="py-3 px-2 text-slate-400">{item.category}</td>
                    <td className="py-3 px-2 font-semibold text-white">{item.sales} Units</td>
                    <td className="py-3 px-2 text-slate-400">{item.rentCount} Rentals</td>
                    <td className="py-3 px-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded px-2.5 py-0.5 animate-pulse">
                        Hot Item
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
