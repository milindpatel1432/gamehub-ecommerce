import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Download, Calendar, ShieldCheck, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const location = useLocation();
  const orderItems = location.state?.orderItems || [
    // Fallback static items in case page is loaded directly without checkout routing
    {
      id: 1,
      title: 'Cyber Odyssey 2077',
      platform: 'PS5',
      mode: 'rent',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
      quantity: 1,
    },
    {
      id: 2,
      title: 'PlayStation 5 Console',
      platform: '',
      mode: 'buy',
      price: 499.00,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80',
      quantity: 1,
    }
  ];

  const subtotal = location.state?.subtotal || orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = location.state?.tax !== undefined ? location.state.tax : (subtotal * 0.08);
  const deliveryMethod = location.state?.deliveryMethod || { name: 'Standard Shipping', price: 0 };
  const shippingCost = deliveryMethod.price;
  const grandTotal = location.state?.total || (subtotal + tax + shippingCost);

  const orderId = location.state?.orderId ? `#${location.state.orderId}` : '#GH-8392-491';

  const handleDownloadInvoice = () => {
    // Print window simulated invoice download
    window.print();
  };

  return (
    <div className="w-full bg-gaming-dark min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        
        {/* Success Header banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-gaming-border bg-gaming-card/45 p-8 text-center space-y-6 shadow-[0_0_35px_rgba(0,229,255,0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <CheckCircle2 className="h-16 w-16 text-gaming-cyan animate-pulse" />
            </motion.div>
            
            <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
              Order Confirmed!
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              Order ID: <strong className="text-gaming-cyan">{orderId}</strong>
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mx-auto">
            Thank you for shopping at GameHub. Your order has been placed successfully. A receipt and tracking summary are sent to your email address.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/shop"
              className="h-12 px-8 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,229,255,0.15)] cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="h-12 px-8 rounded-full border border-gaming-border hover:border-gaming-cyan bg-gaming-black/40 hover:bg-gaming-cyan/5 text-slate-300 hover:text-gaming-cyan font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              View My Orders
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDownloadInvoice}
              className="h-12 px-8 rounded-full border border-gaming-border hover:border-white bg-gaming-black/20 hover:bg-white/5 text-slate-400 hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer print:hidden"
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </button>
          </div>
        </motion.div>

        {/* Order Details summary list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-gaming-border bg-gaming-card/30 p-6 md:p-8 text-left space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gaming-border/60">
            <h3 className="font-gaming text-lg font-bold text-white tracking-wider">
              Item Summary
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Est. Delivery: <strong className="text-white">Tomorrow, Oct 25</strong></span>
            </div>
          </div>

          {/* Items stack */}
          <div className="divide-y divide-gaming-border/40">
            {orderItems.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gaming-black/25 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{item.platform ? item.platform : 'Digital'}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{item.mode || 'buy'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8 text-right">
                  <div className="text-xs text-slate-400">
                    Qty: <strong className="text-white font-bold">{item.quantity}</strong>
                  </div>
                  <span className="font-gaming text-sm font-bold text-gaming-cyan">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing totals */}
          <div className="border-t border-gaming-border/60 pt-4 space-y-3.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery Method ({deliveryMethod.name})</span>
              <span className={`font-bold ${shippingCost === 0 ? 'text-green-500' : 'text-white'}`}>
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-white">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gaming-border/60 pt-4 text-base font-bold text-white">
              <span className="font-gaming uppercase tracking-wider">Grand Total</span>
              <span className="font-gaming text-gaming-cyan text-xl tracking-wide">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
