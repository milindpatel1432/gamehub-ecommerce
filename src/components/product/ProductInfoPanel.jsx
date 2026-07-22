import { useState } from 'react';
import { Star, Heart, Share2, Box, Calendar, ShoppingCart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function ProductInfoPanel({ product }) {
  const navigate = useNavigate();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const productId = product?.id;
  const isWished = isWishlisted(productId);

  const [purchaseMode, setPurchaseMode] = useState(product?.isRental ? 'rent' : 'buy');
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (isWished) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        platform: product.platform,
        buyPrice: product.buyPrice,
        rentPrice: product.rentPrice,
        image: product.image,
        category: product.category,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  if (!product) return null;

  return (
    <div className="w-full text-left space-y-6">
      
      {/* Badges & Rating */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {product.platform && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/85 border border-gaming-cyan/35 rounded px-2.5 py-0.5">
              {product.platform}
            </span>
          )}
          {product.category && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/85 border border-gaming-cyan/35 rounded px-2.5 py-0.5">
              {product.category}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-bold text-white">{product.rating}</span>
          <span className="text-xs text-slate-500">({product.reviews} reviews)</span>
        </div>
      </div>

      {/* Product Title */}
      <div className="space-y-1.5">
        <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          {product.title}
        </h2>
        <p className="text-sm text-slate-400">
          Condition: <span className="text-white font-semibold">{product.condition}</span>
        </p>
      </div>

      {/* Action / Option Selectors Block */}
      <div className="rounded-2xl border border-gaming-border bg-gaming-card/40 p-5 space-y-6">
        
        {/* Toggle Mode Buttons */}
        {product.isRental && (
          <div className="grid grid-cols-2 gap-2 bg-gaming-black/60 rounded-xl p-1 border border-gaming-border/60">
            <button
              onClick={() => setPurchaseMode('buy')}
              className={`h-11 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                purchaseMode === 'buy'
                  ? 'bg-gaming-accent text-white shadow-[0_0_12px_rgba(0,136,255,0.3)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Buy Now
            </button>
            <button
              onClick={() => setPurchaseMode('rent')}
              className={`h-11 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                purchaseMode === 'rent'
                  ? 'bg-gaming-accent text-white shadow-[0_0_12px_rgba(0,136,255,0.3)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Rent Game
            </button>
          </div>
        )}

        {/* Dynamic Price Display */}
        <div className="space-y-4">
          {purchaseMode === 'buy' ? (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold font-gaming text-white tracking-wide">₹{product.buyPrice}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-slate-500 line-through font-semibold">₹{product.originalPrice}</span>
                  <span className="text-[10px] font-bold text-white bg-orange-600 px-2 py-0.5 rounded">
                    -{Math.round((1 - product.buyPrice / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-gaming text-gaming-cyan tracking-wide">₹{product.rentPrice}</span>
                <span className="text-xs text-slate-400 font-semibold">/ weekly</span>
              </div>
              <div className="flex items-center gap-2 p-3.5 rounded-xl border border-gaming-cyan/20 bg-gaming-cyan/5 text-xs text-gaming-cyan">
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>Requires a fully-refundable <strong>₹40.00 security deposit</strong>.</span>
              </div>
            </div>
          )}

          {/* Delivery & Stock indicators */}
          <div className="space-y-3.5 pt-2 text-sm">
            {product.stock > 0 ? (
              <div className="flex items-center gap-3 text-green-500">
                <Box className="h-5 w-5" />
                <span className="font-semibold">In Stock ({product.stock} units) - Ready to Ship</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-red-500">
                <Box className="h-5 w-5" />
                <span className="font-semibold">Out of Stock</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="h-5 w-5 text-slate-500" />
              <span>Est. delivery: <strong className="text-white font-semibold">Tomorrow, Oct 25</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Primary CTA */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
                return;
              }
              addToCart({
                id: product.id,
                title: product.title,
                platform: product.platform,
                mode: purchaseMode,
                price: purchaseMode === 'buy' ? product.buyPrice : product.rentPrice,
                originalPrice: purchaseMode === 'buy' ? (product.originalPrice || product.buyPrice) : (product.rentPrice * 1.2),
                image: product.image,
                deposit: purchaseMode === 'rent' ? 40.00 : 0,
              });
              navigate('/cart');
            }}
            className="w-full h-14 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,136,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>

          {/* Secondary CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('login');
                  return;
                }
                navigate('/checkout');
              }}
              className="flex-1 h-12 rounded-full border border-gaming-border hover:border-gaming-cyan bg-gaming-black/30 hover:bg-gaming-black/60 text-xs font-bold uppercase tracking-wider text-white hover:text-gaming-cyan transition-all cursor-pointer"
            >
              {purchaseMode === 'buy' ? 'Buy Now' : 'Rent Now'}
            </button>
            
            <button
              onClick={handleWishlistToggle}
              className="w-12 h-12 rounded-full border border-gaming-border bg-gaming-black/30 hover:bg-gaming-black/60 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Heart className={`h-5 w-5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full border border-gaming-border bg-gaming-black/30 hover:bg-gaming-black/60 flex items-center justify-center text-slate-300 hover:text-gaming-cyan transition-colors cursor-pointer"
              >
                <Share2 className="h-5 w-5" />
              </button>
              {shareSuccess && (
                <span className="absolute bottom-14 right-1/2 translate-x-1/2 bg-gaming-cyan text-gaming-black text-[9px] font-bold py-1 px-2.5 rounded shadow whitespace-nowrap uppercase tracking-wider animate-bounce">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

