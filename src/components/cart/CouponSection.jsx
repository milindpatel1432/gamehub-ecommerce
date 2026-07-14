import { useState } from 'react';
import { Tag, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CouponSection({ onApplyCoupon }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    // Check code (Demo support for GAMEHUB10 and GAMEHUB50)
    const upperCode = code.toUpperCase();
    if (upperCode === 'GAMEHUB10') {
      setStatus({ type: 'success', message: '10% discount coupon applied!' });
      onApplyCoupon(0.10); // 10% discount
    } else if (upperCode === 'GAMEHUB50') {
      setStatus({ type: 'success', message: '$50 discount coupon applied!' });
      onApplyCoupon(50); // Flat $50 discount
    } else {
      setStatus({ type: 'error', message: 'Invalid or expired coupon code.' });
      onApplyCoupon(0);
    }
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 text-left space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
        <Tag className="h-4.5 w-4.5 text-gaming-cyan" />
        Have a Coupon Code?
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Enter code (e.g. GAMEHUB10)"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStatus({ type: '', message: '' }); // reset status on type
          }}
          className="flex-1 h-12 px-5 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 transition-all"
        />
        <button
          type="submit"
          className="h-12 px-6 rounded-xl border border-gaming-border hover:border-gaming-cyan text-sm font-bold text-white hover:text-gaming-cyan bg-gaming-black/20 hover:bg-gaming-cyan/5 transition-all cursor-pointer"
        >
          Apply
        </button>
      </form>

      {/* Alerts messages */}
      {status.message && (
        <div className={`flex items-center gap-2 text-xs font-semibold ${
          status.type === 'success' ? 'text-green-500' : 'text-red-500'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{status.message}</span>
        </div>
      )}

    </div>
  );
}
