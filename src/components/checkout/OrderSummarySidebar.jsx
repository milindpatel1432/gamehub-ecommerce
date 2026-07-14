import { Lock, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function OrderSummarySidebar({
  currentStep = 1,
  deliveryMethod,
  onNextStep,
}) {
  const { cartItems, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shippingCost = deliveryMethod?.price || 0;
  const isShippingCalculated = currentStep > 1;

  const grandTotal = subtotal + tax + shippingCost;

  const getButtonText = () => {
    if (currentStep === 1) return 'Continue to Delivery';
    if (currentStep === 2) return 'Continue to Payment';
    if (currentStep === 3) return 'Continue to Review';
    return 'Place Order';
  };

  return (
    <div className="rounded-3xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 text-left">
      
      {/* Title */}
      <h3 className="font-gaming text-lg font-bold text-white tracking-wider pb-4 border-b border-gaming-border/60">
        Order Summary
      </h3>

      {/* Product List */}
      <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            {/* Image */}
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gaming-black/20 flex-shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-bold text-white text-xs truncate max-w-[120px]">
                  {item.title}
                </h4>
                {item.mode === 'rent' && (
                  <span className="text-[7px] uppercase font-bold tracking-wider text-gaming-black bg-gaming-cyan px-1 rounded">
                    Rent
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                {item.platform ? `${item.platform} Edition` : 'Digital Edition'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>${item.price.toFixed(2)}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="space-y-3.5 text-xs text-slate-400 border-t border-gaming-border/60 pt-4">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className={`font-bold ${isShippingCalculated ? 'text-white' : 'text-slate-500 italic'}`}>
            {isShippingCalculated
              ? shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`
              : 'Calculated next step'}
          </span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
          <span>Estimated Tax</span>
          <span className="font-bold text-white">${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-end justify-between py-2">
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-white font-gaming">Grand Total</span>
          <p className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider">Inc. All Taxes</p>
        </div>
        <span className="text-3xl font-extrabold font-gaming text-white tracking-wide">
          ${grandTotal.toFixed(2)}
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={onNextStep}
        className="w-full h-14 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,136,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
      >
        {getButtonText()}
        <ArrowRight className="h-4.5 w-4.5 animate-pulse" />
      </button>

      {/* SSL graphic lock */}
      <div className="flex items-center justify-center gap-2 text-slate-500 pt-2 text-[10px] uppercase font-bold tracking-wider">
        <Lock className="h-4 w-4" />
        Secure SSL Encrypted Checkout
      </div>

    </div>
  );
}
