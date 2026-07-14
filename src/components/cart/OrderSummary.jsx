import { Info, Truck, Landmark, ArrowRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderSummary({ summaryData }) {
  const {
    subtotal,
    rentalCharges,
    deposit,
    shipping,
    tax,
    total,
    deliveryDate = 'Tomorrow, Oct 25',
    refundDate = 'Nov 5',
  } = summaryData;

  return (
    <div className="rounded-3xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 text-left relative">
      
      {/* Title */}
      <h3 className="font-gaming text-lg font-bold text-white tracking-wider pb-4 border-b border-gaming-border/60">
        Order Summary
      </h3>

      {/* Breakdown Items */}
      <div className="space-y-4 text-sm text-slate-400">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Rental Charges</span>
          <span className="font-bold text-white">${rentalCharges.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>Security Deposit</span>
            <div className="group relative">
              <Info className="h-4 w-4 text-slate-500 cursor-pointer" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-gaming-black border border-gaming-border p-2 rounded text-[10px] text-slate-300 leading-normal z-25">
                Refunded in full once physical rental items are returned back.
              </div>
            </div>
          </div>
          <span className="font-bold text-gaming-cyan">${deposit.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="font-bold text-green-500">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
          <span>Tax</span>
          <span className="font-bold text-white">${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total Section */}
      <div className="flex items-end justify-between py-2">
        <div className="space-y-1">
          <span className="text-sm font-bold text-white font-gaming">Total</span>
          <p className="text-[10px] text-slate-500 font-semibold uppercase">VAT Included</p>
        </div>
        <span className="text-3xl font-extrabold font-gaming text-white tracking-wide">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Delivery estimates widget */}
      <div className="rounded-2xl border border-gaming-border/80 bg-gaming-black/60 p-4.5 space-y-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Truck className="h-4.5 w-4.5 text-slate-500" />
          <span>Estimated Delivery: <strong className="text-white font-semibold">{deliveryDate}</strong></span>
        </div>
        {rentalCharges > 0 && (
          <div className="flex items-center gap-3">
            <Landmark className="h-4.5 w-4.5 text-gaming-cyan" />
            <span>Expected Refund: <strong className="text-gaming-cyan font-semibold">{refundDate}</strong></span>
          </div>
        )}
      </div>

      {/* Primary Checkout CTA */}
      <Link to="/checkout" className="w-full h-14 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,136,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
        Proceed to Checkout
        <ArrowRight className="h-4.5 w-4.5 animate-pulse" />
      </Link>

      {/* Credit cards graphics fallback */}
      <div className="flex items-center justify-center gap-4 text-slate-600 pt-2">
        <CreditCard className="h-5 w-5" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Visa • Mastercard • Amex • PayPal</span>
      </div>

    </div>
  );
}
