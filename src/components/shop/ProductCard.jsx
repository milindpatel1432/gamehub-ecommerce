import { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFav = isWishlisted(product.id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isFav) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const {
    title,
    platform,
    rating,
    reviews,
    buyPrice,
    originalPrice,
    rentPrice,
    image,
    isSale,
    isRental,
  } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/45 overflow-hidden text-left"
    >
      {/* Product Image Cover */}
      <div className="relative h-56 w-full overflow-hidden bg-gaming-black/20 group">
        <Link to={`/product/${product.id || 1}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        
        {/* Quick View hover button overlay */}
        <div className="absolute inset-0 bg-gaming-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-5">
          <button
            onClick={() => navigate(`/product/${product.id || 1}`)}
            className="h-9 px-4 rounded-lg bg-gaming-cyan text-gaming-black hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] text-xs font-bold transition-all cursor-pointer"
          >
            Quick View
          </button>
        </div>

        {/* Top-Left Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {platform && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/85 border border-gaming-cyan/35 rounded px-2.5 py-0.5">
              {platform}
            </span>
          )}
          {isSale && (
            <span className="text-[9px] uppercase font-bold tracking-wider text-white bg-orange-600 rounded px-2.5 py-0.5 self-start">
              Sale
            </span>
          )}
          {isRental && (
            <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-black bg-gaming-cyan rounded px-2.5 py-0.5 self-start">
              Rental
            </span>
          )}
        </div>

        {/* Favorite heart button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gaming-black/70 hover:bg-gaming-black/90 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors border border-gaming-border/60 cursor-pointer"
        >
          <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Info content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Star ratings */}
          {rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3.5 w-3.5 fill-yellow-500" />
              <span className="text-xs font-bold text-white">{rating}</span>
              <span className="text-[10px] text-slate-500">({reviews})</span>
            </div>
          )}
          
          <Link to={`/product/${product.id || 1}`}>
            <h3 className="font-gaming text-base font-bold text-white tracking-wide leading-snug line-clamp-2 hover:text-gaming-cyan transition-colors">
              {title}
            </h3>
          </Link>
        </div>

        {/* Pricing & CTA */}
        <div className="space-y-4 pt-2 border-t border-gaming-border/40">
          {/* Prices */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-gaming">₹{buyPrice}</span>
            {originalPrice && (
              <span className="text-xs text-slate-500 line-through font-semibold">₹{originalPrice}</span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  title: product.title,
                  platform: product.platform,
                  buyPrice: product.buyPrice,
                  rentPrice: product.rentPrice,
                  image: product.image,
                  category: product.category,
                });
                navigate('/cart');
              }}
              className="w-full h-10 rounded-xl bg-gaming-accent hover:bg-gaming-cyan text-white hover:text-gaming-black font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </button>
            
            {rentPrice && (
              <button
                onClick={() => navigate(`/product/${product.id || 1}`)}
                className="w-full h-10 rounded-xl border border-gaming-border hover:border-gaming-cyan/60 bg-gaming-black/20 hover:bg-gaming-cyan/5 text-slate-300 hover:text-gaming-cyan font-semibold text-xs transition-all duration-300 cursor-pointer"
              >
                Rent for ₹{rentPrice}/mo
              </button>
            )}
          </div>
        </div>
      </div>

    </motion.div>
  );
}
