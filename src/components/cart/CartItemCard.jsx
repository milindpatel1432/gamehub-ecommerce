import { Trash2, Heart, Bookmark, Calendar, ShieldCheck, Truck, Layers, CheckCircle } from 'lucide-react';

export default function CartItemCard({ item, onQuantityChange, onRemove, onWishlist }) {
  const {
    id,
    title,
    platform,
    mode, // 'rent' or 'buy'
    price,
    originalPrice,
    image,
    quantity,
    // Rent specific
    duration,
    dates,
    deposit,
    // Buy specific
    inStock,
    expressDelivery,
  } = item;

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/30 p-5 flex flex-col md:flex-row gap-5 items-stretch text-left">
      
      {/* Product Image */}
      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gaming-black/20 flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Info content */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-gaming text-base sm:text-lg font-bold text-white tracking-wide">
              {title} {platform && `(${platform})`}
            </h3>
            
            {/* Rent Details Grid */}
            {mode === 'rent' ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Duration: <strong>{duration}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{dates}</span>
                </div>
                <div className="flex items-center gap-2 text-gaming-cyan">
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Security Deposit: <strong>${deposit.toFixed(2)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span>Quantity:</span>
                  <div className="flex items-center gap-2 border border-gaming-border/60 rounded-md px-2.5 py-0.5 bg-gaming-black/20 ml-1">
                    <button
                      onClick={() => onQuantityChange(id, quantity - 1)}
                      className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-white font-bold text-xs px-1 min-w-[10px] text-center">{quantity}</span>
                    <button
                      onClick={() => onQuantityChange(id, quantity + 1)}
                      className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Buy Details Grid */
              <div className="flex flex-col gap-1.5 mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>Stock Status: <strong>{inStock ? 'In Stock' : 'Out of Stock'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-500" />
                  <span>{expressDelivery ? 'Eligible for Express Delivery' : 'Standard Delivery'}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span>Quantity:</span>
                  <div className="flex items-center gap-2 border border-gaming-border/60 rounded-md px-2.5 py-0.5 bg-gaming-black/20 ml-1">
                    <button
                      onClick={() => onQuantityChange(id, quantity - 1)}
                      className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-white font-bold text-xs px-1 min-w-[10px] text-center">{quantity}</span>
                    <button
                      onClick={() => onQuantityChange(id, quantity + 1)}
                      className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buy/Rent Badge */}
          <span className={`text-[10px] uppercase font-bold tracking-wider rounded px-3 py-1 ${
            mode === 'rent'
              ? 'bg-gaming-cyan/15 text-gaming-cyan border border-gaming-cyan/30'
              : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
          }`}>
            {mode}
          </span>
        </div>

        {/* Lower Row: Actions & Pricing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gaming-border/40 pt-4">
          {/* Action buttons */}
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <button
              onClick={() => onRemove(id)}
              className="flex items-center gap-2 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>

            {mode === 'rent' ? (
              <button
                onClick={() => onWishlist(id)}
                className="flex items-center gap-2 hover:text-gaming-cyan transition-colors cursor-pointer"
              >
                <Heart className="h-4 w-4" />
                Move to Wishlist
              </button>
            ) : (
              <button
                onClick={() => onWishlist(id)}
                className="flex items-center gap-2 hover:text-gaming-cyan transition-colors cursor-pointer"
              >
                <Bookmark className="h-4 w-4" />
                Save for Later
              </button>
            )}
          </div>

          {/* Price display */}
          <div className="text-right flex items-baseline gap-2 self-end sm:self-auto">
            {originalPrice && (
              <span className="text-xs text-slate-500 line-through font-semibold">${originalPrice.toFixed(2)}</span>
            )}
            <span className={`text-xl font-extrabold font-gaming tracking-wide ${
              mode === 'rent' ? 'text-gaming-cyan' : 'text-white'
            }`}>
              ${price.toFixed(2)}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
