import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';

import 'swiper/css';

export default function TrendingGames() {
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getFeaturedProducts();
      const featuredList = res?.data || [];
      setGames(Array.isArray(featuredList) ? featuredList : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section className="bg-gaming-black py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-left">
            <h2 className="font-gaming text-3xl font-extrabold tracking-wide text-white">
              Trending Now
            </h2>
            <p className="text-sm text-slate-400 mt-1">The most played titles this week</p>
          </div>
          
          {/* Slider navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full border border-gaming-border bg-gaming-card hover:bg-gaming-accent hover:border-gaming-accent text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full border border-gaming-border bg-gaming-card hover:bg-gaming-accent hover:border-gaming-accent text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        {isLoading ? (
          <LoadingSpinner text="Fetching trending games..." />
        ) : error ? (
          <ErrorState 
            title="Failed to Load Trending Games" 
            description={error} 
            onRetry={fetchFeatured} 
          />
        ) : games.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gaming-border rounded-2xl">
            <p className="text-slate-400 font-semibold">No featured games found at the moment.</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="w-full"
          >
            {games.map((game) => (
              <SwiperSlide key={game.id}>
                <div className="glass-card flex flex-col h-full rounded-2xl border border-gaming-border bg-gaming-card overflow-hidden">
                  {/* Cover Image */}
                  <Link to={`/product/${game.id}`} className="relative h-48 w-full overflow-hidden block">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {/* Platform Badge */}
                    <span className="absolute top-4 left-4 z-10 text-[10px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/85 border border-gaming-cyan/30 rounded-full px-2.5 py-1">
                      {game.platform}
                    </span>
                  </Link>

                  {/* Info Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                    <div>
                      <Link to={`/product/${game.id}`}>
                        <h3 className="font-gaming text-lg font-bold text-white hover:text-gaming-cyan transition-colors truncate">
                          {game.title}
                        </h3>
                      </Link>
                      
                      {/* Rating stars */}
                      <div className="flex items-center gap-1 mt-2 text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span className="text-sm font-semibold text-white">{game.rating}</span>
                        <span className="text-xs text-slate-400">({game.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Pricing grid */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gaming-border/50 pt-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Buy New</span>
                        <p className="text-sm font-bold text-white mt-0.5">${game.buyPrice}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Rent Weekly</span>
                        <p className="text-sm font-bold text-gaming-cyan mt-0.5">{game.rentPrice ? `$${game.rentPrice}/mo` : 'N/A'}</p>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => navigate('/cart')}
                      className="w-full h-11 rounded-xl bg-gaming-border/80 hover:bg-gaming-accent text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </section>
  );
}
