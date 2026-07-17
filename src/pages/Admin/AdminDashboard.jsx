import { Sparkles, ShoppingCart, BarChart3, TrendingUp } from 'lucide-react';
import AdminStats from '../../components/admin/AdminStats';
import AdminOrders from '../../components/admin/AdminOrders';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 text-left">
      {/* Greetings Header banner */}
      <div className="rounded-3xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gaming-cyan flex items-center gap-1.5 font-gaming">
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

      {/* Placeholder Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sales Overview Chart */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-gaming-cyan" />
                Sales Overview
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Monthly Revenue Trend
              </p>
            </div>
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% MoM
            </span>
          </div>

          <div className="h-48 flex items-end gap-3.5 pb-2 border-b border-gaming-border/20 pt-6">
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-cyan/20 group-hover:bg-gaming-cyan/45 rounded-t h-[40%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-cyan opacity-0 group-hover:opacity-100 transition-opacity">$1.2k</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-cyan/20 group-hover:bg-gaming-cyan/45 rounded-t h-[60%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-cyan opacity-0 group-hover:opacity-100 transition-opacity">$2.1k</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-cyan/20 group-hover:bg-gaming-cyan/45 rounded-t h-[50%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-cyan opacity-0 group-hover:opacity-100 transition-opacity">$1.8k</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-cyan/25 group-hover:bg-gaming-cyan/45 rounded-t h-[80%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-cyan opacity-0 group-hover:opacity-100 transition-opacity">$3.2k</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-cyan/30 group-hover:bg-gaming-cyan/50 rounded-t h-[95%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-cyan opacity-0 group-hover:opacity-100 transition-opacity">$4.5k</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">May</span>
            </div>
          </div>
        </div>

        {/* Orders Overview Chart */}
        <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-gaming text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <ShoppingCart className="h-4.5 w-4.5 text-gaming-accent" />
                Orders Overview
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Monthly Transaction Count
              </p>
            </div>
            <span className="text-[10px] font-bold text-gaming-accent bg-gaming-accent/10 px-2 py-0.5 rounded flex items-center gap-1">
              +8% MoM
            </span>
          </div>

          <div className="h-48 flex items-end gap-3.5 pb-2 border-b border-gaming-border/20 pt-6">
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-accent/15 group-hover:bg-gaming-accent/40 rounded-t h-[30%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-accent opacity-0 group-hover:opacity-100 transition-opacity">12</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-accent/15 group-hover:bg-gaming-accent/40 rounded-t h-[50%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-accent opacity-0 group-hover:opacity-100 transition-opacity">25</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-accent/15 group-hover:bg-gaming-accent/40 rounded-t h-[45%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-accent opacity-0 group-hover:opacity-100 transition-opacity">20</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-accent/20 group-hover:bg-gaming-accent/40 rounded-t h-[70%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-accent opacity-0 group-hover:opacity-100 transition-opacity">38</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full bg-gaming-accent/20 group-hover:bg-gaming-accent/45 rounded-t h-[85%] transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-gaming-accent opacity-0 group-hover:opacity-100 transition-opacity">48</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">May</span>
            </div>
          </div>
        </div>

      </div>

      {/* Split lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-3">
          <AdminOrders limit={5} />
        </div>
      </div>

    </div>
  );
}
