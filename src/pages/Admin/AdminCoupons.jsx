import { Ticket } from 'lucide-react';

export default function AdminCoupons() {
  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-8 text-center space-y-4">
      <div className="mx-auto w-12 h-12 rounded-xl bg-gaming-cyan/10 flex items-center justify-center text-gaming-cyan shadow-[0_0_15px_rgba(0,229,255,0.1)]">
        <Ticket className="h-6 w-6" />
      </div>
      <div className="space-y-2 max-w-sm mx-auto">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider">
          Coupons & Promo Codes
        </h3>
        <p className="text-xs text-slate-400 leading-normal">
          This module allows admins to create discounts, configure active dates, and set rules for customer cart promotions.
        </p>
      </div>
      <div className="pt-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
        Under Development / UI Placeholder
      </div>
    </div>
  );
}
