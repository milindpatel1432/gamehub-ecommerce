import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Gamepad } from 'lucide-react';
import ProductGallery from '../../components/product/ProductGallery';
import ProductTabs from '../../components/product/ProductTabs';
import ProductInfoPanel from '../../components/product/ProductInfoPanel';
import ProductFAQ from '../../components/product/ProductFAQ';
import { useWishlist } from '../../context/WishlistContext';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { productService } from '../../services/productService';
import { useState, useEffect } from 'react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetails = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getProductById(id);
      if (res.success && res.data) {
        setProduct(res.data);
        
        // Fetch related products of the same category
        const allProductsRes = await productService.getAllProducts();
        const relatedList = allProductsRes?.data || [];
        const related = relatedList
          .filter((p) => p.category === res.data.category && p.id !== res.data.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch product details.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full bg-gaming-dark py-16 px-4 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner text="Fetching product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full bg-gaming-dark py-16 px-4 flex items-center justify-center min-h-[70vh]">
        <ErrorState
          icon={Gamepad}
          title="Product Not Found"
          description={error || "The gaming equipment or titles you requested coordinates for do not exist."}
          retryText="Back to Shop"
          onRetry={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-gaming-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
          <Link to="/" className="hover:text-gaming-cyan transition-colors">Home</Link>
          <span>&gt;</span>
          <Link to="/shop" className="hover:text-gaming-cyan transition-colors">Shop</Link>
          <span>&gt;</span>
          <span className="text-slate-500">{product.platform || product.category}</span>
          <span>&gt;</span>
          <span className="text-gaming-cyan">{product.title}</span>
        </nav>

        {/* Main Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Gallery & Tabs */}
          <div className="lg:col-span-7 space-y-8">
            <ProductGallery product={product} />
            <ProductTabs product={product} onRatingChange={() => fetchProductDetails(true)} />
          </div>

          {/* Right Column: Info & FAQs */}
          <div className="lg:col-span-5 space-y-8">
            <ProductInfoPanel product={product} />
            <ProductFAQ />
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-8 pt-16 border-t border-gaming-border/60">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <h2 className="font-gaming text-3xl font-extrabold tracking-wide text-white text-left">
              Trending Now
            </h2>
            
            {/* Arrows */}
            <div className="flex items-center gap-2.5">
              <button className="w-9 h-9 rounded-full border border-gaming-border bg-gaming-card hover:bg-gaming-accent text-white flex items-center justify-center transition-colors cursor-pointer">
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button className="w-9 h-9 rounded-full border border-gaming-border bg-gaming-card hover:bg-gaming-accent text-white flex items-center justify-center transition-colors cursor-pointer">
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/45 overflow-hidden text-left"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-gaming-black/25 block group">
                  <Link to={`/product/${prod.id}`}>
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>
                  {prod.isSale && (
                    <span className="absolute bottom-4 left-4 z-10 text-[9px] uppercase font-bold tracking-wider text-gaming-black bg-gaming-cyan rounded px-2.5 py-0.5">
                      Sale
                    </span>
                  )}

                  {/* Heart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isWishlisted(prod.id)) {
                        removeFromWishlist(prod.id);
                      } else {
                        addToWishlist({
                          id: prod.id,
                          title: prod.title,
                          platform: prod.platform || 'PS5',
                          buyPrice: prod.buyPrice,
                          image: prod.image,
                          category: prod.category || 'Games',
                        });
                      }
                    }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gaming-black/70 hover:bg-gaming-black/90 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors border border-gaming-border/60 cursor-pointer animate-fade-in"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted(prod.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Info & Cart Icon */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Link to={`/product/${prod.id}`}>
                      <h3 className="font-gaming text-sm font-bold text-white tracking-wide truncate max-w-[160px] hover:text-gaming-cyan transition-colors">
                        {prod.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">
                      {prod.platform} | {prod.category}
                    </p>
                    <p className="text-base font-bold text-white font-gaming mt-2">
                      ₹{prod.buyPrice}
                    </p>
                  </div>

                   {/* Add to cart bubble button */}
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-10 h-10 rounded-xl bg-gaming-border/80 hover:bg-gaming-accent text-white hover:shadow-[0_0_15px_rgba(0,136,255,0.4)] flex items-center justify-center transition-all duration-300 cursor-pointer"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
