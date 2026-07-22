import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { successToast } from '../../utils/toast';
import SkeletonGrid from '../../components/ui/SkeletonGrid';
import ErrorState from '../../components/ui/ErrorState';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, isLoading, error, removeFromWishlist, fetchWishlist, moveToCart } = useWishlist();
  const { fetchCart } = useCart();

  const handleMoveToCart = async (item) => {
    try {
      const options = {
        isRental: !!item.rentPrice,
        rentDuration: item.duration || '7 Days',
      };
      await moveToCart(item.id, options);
      // Reload cart state from server
      await fetchCart();
      successToast(`Moved ${item.title} to shopping cart!`);
      navigate('/cart');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-gaming-dark py-12 px-4 sm:px-6 lg:px-8 min-h-[75vh]">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
          <Link to="/" className="hover:text-gaming-cyan transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-gaming-cyan">Wishlist</span>
        </nav>

        {/* Header */}
        <div className="text-left pb-6 border-b border-gaming-border">
          <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
            My Wishlist <span className="text-sm font-semibold text-slate-500 lowercase ml-2">({wishlistItems.length} items)</span>
          </h1>
        </div>

        {isLoading ? (
          /* Loading State */
          <div className="py-8">
            <SkeletonGrid count={4} />
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-12">
            <ErrorState 
              title="Failed to Load Wishlist" 
              description={error} 
              onRetry={fetchWishlist} 
            />
          </div>
        ) : wishlistItems.length > 0 ? (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/45 overflow-hidden justify-between"
              >
                {/* Cover Image & badge */}
                <div className="relative h-48 w-full overflow-hidden bg-gaming-black/25">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.platform && (
                    <span className="absolute top-4 left-4 z-10 text-[9px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/85 border border-gaming-cyan/35 rounded px-2 py-0.5">
                      {item.platform}
                    </span>
                  )}
                  
                  {/* Buy/Rent Badge */}
                  <span className={`absolute top-4 right-4 z-10 text-[8px] uppercase font-bold tracking-wider rounded px-2.5 py-0.5 ${
                    item.rentPrice
                      ? 'bg-gaming-cyan text-gaming-black font-extrabold'
                      : 'bg-orange-600 text-white'
                  }`}>
                    {item.rentPrice ? 'Rent' : 'Buy'}
                  </span>
                </div>

                {/* Card Content details */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-gaming text-base font-bold text-white tracking-wide truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm font-bold text-gaming-cyan font-gaming">
                      ₹{item.buyPrice ? item.buyPrice.toFixed(2) : '0.00'}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-gaming-border/40">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full h-10 rounded-xl bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-full h-10 rounded-xl border border-gaming-border hover:border-red-500/50 bg-gaming-black/20 hover:bg-red-500/5 text-slate-400 hover:text-red-500 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-28 border border-dashed border-gaming-border rounded-3xl space-y-6 max-w-xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <Heart className="h-14 w-14 text-slate-600 stroke-[1.5px]" />
              <h2 className="font-gaming text-xl font-bold text-white tracking-wider">
                ❤️ Your Wishlist is Empty
              </h2>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">
                Explore our catalog to add items you want to buy or rent.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-gaming-cyan text-gaming-black hover:text-white hover:bg-gaming-accent font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all duration-300 cursor-pointer"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
