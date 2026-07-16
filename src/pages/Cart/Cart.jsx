import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Gamepad } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItemCard from '../../components/cart/CartItemCard';
import CouponSection from '../../components/cart/CouponSection';
import OrderSummary from '../../components/cart/OrderSummary';
import FrequentlyBought from '../../components/cart/FrequentlyBought';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, addToCart, isLoading, error, fetchCart } = useCart();

  const [discountPercent, setDiscountPercent] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleWishlistItem = (id) => {
    removeFromCart(id);
  };

  const handleApplyCoupon = (discountVal) => {
    if (discountVal < 1) {
      setDiscountPercent(discountVal);
      setFlatDiscount(0);
    } else {
      setFlatDiscount(discountVal);
      setDiscountPercent(0);
    }
  };

  const handleAddRecommended = (prod) => {
    // Check if item already exists
    if (cartItems.some((item) => item.id === prod.id)) return;

    addToCart({
      id: prod.id,
      title: prod.title,
      platform: prod.id === 301 ? 'PS5' : '',
      mode: 'buy',
      price: prod.price,
      image: prod.image,
      inStock: true,
      expressDelivery: false,
    });
  };

  // Compute breakdown logic matching design
  const summaryData = useMemo(() => {
    let subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let rentalCharges = cartItems.reduce((acc, item) => acc + (item.mode === 'rent' ? item.price * item.quantity : 0), 0);
    let deposit = cartItems.reduce((acc, item) => acc + (item.mode === 'rent' ? item.deposit * item.quantity : 0), 0);
    
    // Apply discount
    if (discountPercent > 0) {
      subtotal = subtotal * (1 - discountPercent);
    } else if (flatDiscount > 0) {
      subtotal = Math.max(0, subtotal - flatDiscount);
    }

    let tax = subtotal * 0.08; // 8% tax matching design math
    let shipping = 0; // Free shipping
    let total = subtotal + tax;

    return {
      subtotal,
      rentalCharges,
      deposit,
      shipping,
      tax,
      total,
    };
  }, [cartItems, discountPercent, flatDiscount]);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full bg-gaming-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
          <Link to="/" className="hover:text-gaming-cyan transition-colors">Home</Link>
          <span>&gt;</span>
          <Link to="/shop" className="hover:text-gaming-cyan transition-colors">Shop</Link>
          <span>&gt;</span>
          <span className="text-gaming-cyan">Cart</span>
        </nav>

        {/* Header */}
        <div className="text-left space-y-2 pb-6 border-b border-gaming-border">
          <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
            Shopping Cart <span className="text-sm font-semibold text-slate-500 lowercase ml-2">({totalQuantity} items)</span>
          </h1>
        </div>

        {isLoading ? (
          <LoadingSpinner text="Retrieving your shopping cart..." />
        ) : error ? (
          <ErrorState
            title="Failed to Load Cart"
            description={error}
            onRetry={fetchCart}
          />
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Items, Coupon, Recommendations */}
            <div className="lg:col-span-8 space-y-8">
              {/* Items Card Stack */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden', margin: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CartItemCard
                        item={item}
                        onQuantityChange={updateQuantity}
                        onRemove={handleRemoveItem}
                        onWishlist={handleWishlistItem}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Coupon Form widget */}
              <CouponSection onApplyCoupon={handleApplyCoupon} />

              {/* Related Gear Products */}
              <FrequentlyBought onAddProduct={handleAddRecommended} />
            </div>

            {/* Right Column: Order Summary & Member banner */}
            <div className="lg:col-span-4 space-y-6">
              <OrderSummary summaryData={summaryData} />
              
              {/* Membership promotion graphic banner */}
              <div className="relative overflow-hidden rounded-3xl border border-gaming-cyan/35 bg-gradient-to-r from-gaming-card to-gaming-black p-6 text-left shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gaming-cyan/10 rounded-full blur-2xl" />
                <div className="space-y-2 relative z-10">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-cyan flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 animate-spin-slow" />
                    Elite Membership
                  </span>
                  <h4 className="font-gaming text-sm font-bold text-white tracking-wide">
                    Save $50 on every rental
                  </h4>
                  <p className="text-[11px] text-slate-400">Starting at $19.99/mo</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Empty Cart Alert view */
          <div className="text-center py-24 border border-dashed border-gaming-border rounded-3xl space-y-6">
            <p className="text-slate-400 font-semibold text-lg">🛒 Your Cart is Empty</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-gaming-cyan text-gaming-black hover:text-white hover:bg-gaming-accent font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all duration-300 cursor-pointer animate-pulse"
            >
              Continue Shopping
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
