import { TrendingUp, ShoppingBag, Calendar, Sparkles } from 'lucide-react';

export default function AdminAnalytics() {
  const chartData = [
    { label: 'Jan', revenue: 40, orders: 30, rentals: 25 },
    { label: 'Feb', revenue: 60, orders: 45, rentals: 35 },
    { label: 'Mar', revenue: 50, orders: 35, rentals: 30 },
    { label: 'Apr', revenue: 80, orders: 60, rentals: 48 },
    { label: 'May', revenue: 95, orders: 75, rentals: 55 },
    { label: 'Jun', revenue: 110, orders: 90, rentals: 65 },
  ];

  const popular = [
    { title: 'Cyber Odyssey 2077', category: 'Games', sales: 420, rentCount: 180 },
    { title: 'PS5 Console Bundle', category: 'Consoles', sales: 120, rentCount: 45 },
    { title: 'Xbox Series X Console', category: 'Consoles', sales: 95, rentCount: 30 },
    { title: 'Cosmos Pro Controller', category: 'Accessories', sales: 240, rentCount: 15 },
  ];

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
          
          {/* Custom CSS column chart bars */}
          <div className="h-44 flex items-end gap-3.5 pb-2 border-b border-gaming-border/30">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  style={{ height: `${d.revenue}%` }}
                  className="w-full bg-gaming-cyan/35 border border-gaming-cyan rounded-t group-hover:bg-gaming-cyan/65 transition-all duration-300 relative shadow-[0_0_10px_rgba(0,229,255,0.1)]"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gaming-card border border-gaming-border text-[9px] text-white px-1.5 py-0.5 rounded transition-all font-bold">
                    ${d.revenue * 100}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Orders Trends */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6">
          <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-gaming-accent" />
            Orders Monthly
          </h3>
          
          <div className="h-44 flex items-end gap-3.5 pb-2 border-b border-gaming-border/30">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  style={{ height: `${d.orders}%` }}
                  className="w-full bg-gaming-accent/35 border border-gaming-accent rounded-t group-hover:bg-gaming-accent/65 transition-all duration-300 relative shadow-[0_0_10px_rgba(0,136,255,0.1)]"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gaming-card border border-gaming-border text-[9px] text-white px-1.5 py-0.5 rounded transition-all font-bold">
                    {d.orders}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Rentals Trends */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6">
          <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-orange-400" />
            Rentals Monthly
          </h3>
          
          <div className="h-44 flex items-end gap-3.5 pb-2 border-b border-gaming-border/30">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  style={{ height: `${d.rentals}%` }}
                  className="w-full bg-orange-400/30 border border-orange-400 rounded-t group-hover:bg-orange-400/60 transition-all duration-300 relative shadow-[0_0_10px_rgba(249,115,22,0.1)]"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gaming-card border border-gaming-border text-[9px] text-white px-1.5 py-0.5 rounded transition-all font-bold">
                    {d.rentals}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row: Popular products table */}
      <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2 pb-2 border-b border-gaming-border/60">
          <Sparkles className="h-4.5 w-4.5 text-yellow-500" />
          Popular Gear & Products
        </h3>

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
                    <span className="text-[9px] uppercase font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded px-2.5 py-0.5">
                      Hot Item
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
