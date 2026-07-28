import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Gamepad2,
  Monitor,
  Cpu,
  HardDrive,
  Headphones,
  Flame,
  Tv,
  Layers,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { categories as fallbackCategories } from '../../data/categories';

// Map icons dynamically to category names
const getCategoryIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('console')) return Gamepad2;
  if (lower.includes('game') && !lower.includes('chair')) return Flame;
  if (lower.includes('headset') || lower.includes('accessory') || lower.includes('accessories')) return Headphones;
  if (lower.includes('chair')) return Zap;
  if (lower.includes('monitor') || lower.includes('display')) return Monitor;
  if (lower.includes('graphic') || lower.includes('gpu')) return Tv;
  if (lower.includes('processor') || lower.includes('cpu')) return Cpu;
  if (lower.includes('ram') || lower.includes('ssd') || lower.includes('storage') || lower.includes('power')) return HardDrive;
  if (lower.includes('cabinet') || lower.includes('stream')) return Layers;
  return Sparkles;
};

export default function FeaturedCategories() {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((cat, index) => {
            const fallback =
              fallbackCategories.find((c) => c.name.toLowerCase() === cat.name.toLowerCase()) ||
              fallbackCategories[index % fallbackCategories.length];
            return {
              id: cat.id || cat._id,
              name: cat.name,
              subtitle: cat.description || fallback?.subtitle || 'Gaming Gear & Tech',
              image:
                cat.image ||
                fallback?.image ||
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
              badge: fallback?.badge || 'Gear',
              borderGlow:
                fallback?.borderGlow ||
                'hover:shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:border-gaming-cyan/60',
            };
          });
          setCategoryList(mapped);
        } else {
          setCategoryList(fallbackCategories);
        }
      } catch (err) {
        console.error('Failed to load categories from database:', err);
        setCategoryList(fallbackCategories);
      }
    };
    loadCategories();
  }, []);

  const displayList = categoryList.length > 0 ? categoryList : fallbackCategories;

  // Filter categories dynamically
  const filteredList = displayList.filter((cat) => {
    if (activeFilter === 'all') return true;
    const lower = cat.name.toLowerCase();
    if (activeFilter === 'hardware') {
      return lower.includes('console') || lower.includes('monitor') || lower.includes('chair');
    }
    if (activeFilter === 'components') {
      return lower.includes('graphics') || lower.includes('processor') || lower.includes('ram') || lower.includes('ssd') || lower.includes('power') || lower.includes('cabinet');
    }
    if (activeFilter === 'games') {
      return lower.includes('game') || lower.includes('stream') || lower.includes('accessory');
    }
    return true;
  });

  return (
    <section className="relative bg-gaming-dark py-24 px-4 sm:px-6 lg:px-8 border-b border-gaming-border/80 overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left space-y-3 max-w-2xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Next-Gen Gaming Ecosystem</span>
            </div>

            {/* Section Title */}
            <h2 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-white">
              Elite <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">Categories</span>
            </h2>
            
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Explore our handpicked collection of flagship consoles, blockbuster titles, and ultra-high performance gaming PC hardware.
            </p>
          </div>

          {/* Filter Tabs & View All Button */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Gear' },
              { id: 'hardware', label: 'Systems & Displays' },
              { id: 'components', label: 'PC Components' },
              { id: 'games', label: 'Games & Media' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                    : 'bg-gaming-card/60 text-slate-400 border border-gaming-border/60 hover:text-white hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => navigate('/shop')}
              className="ml-auto md:ml-2 px-4 py-2 rounded-xl border border-gaming-cyan/40 bg-gaming-cyan/10 hover:bg-gaming-cyan text-gaming-cyan hover:text-gaming-black text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.15)] group"
            >
              <span>Browse Shop</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Categories Grid with Animated Layout */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredList.map((cat, index) => {
              const CategoryIcon = getCategoryIcon(cat.name);
              return (
                <motion.div
                  key={cat.id || cat.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
                  className={`group relative h-80 rounded-3xl border border-gaming-border bg-gaming-card overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:border-gaming-cyan/60 ${cat.borderGlow}`}
                >
                  {/* Category Image Cover */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />

                  {/* Gradient Multi-layered Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1d] via-[#0b0f1d]/50 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gaming-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Shimmer Light Sweep Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent z-15" />

                  {/* Top Header Controls (Badge & Icon) */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gaming-cyan bg-[#0b0f1d]/85 border border-gaming-cyan/40 rounded-full px-3 py-1 backdrop-blur-md shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                      {cat.badge}
                    </span>

                    <div className="h-9 w-9 rounded-xl bg-[#0b0f1d]/80 border border-slate-700/60 flex items-center justify-center text-gaming-cyan group-hover:bg-gaming-cyan group-hover:text-gaming-black group-hover:border-gaming-cyan group-hover:scale-110 transition-all duration-300 shadow-md backdrop-blur-md">
                      <CategoryIcon className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute bottom-5 left-5 right-5 z-20 text-left space-y-2">
                    <div>
                      <h3 className="font-gaming text-lg font-extrabold text-white group-hover:text-gaming-cyan transition-colors leading-snug line-clamp-1 group-hover:translate-x-0.5 transition-transform duration-300">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>

                    {/* Explore CTA link hint */}
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-gaming-cyan opacity-80 group-hover:opacity-100 transition-all">
                      <span>Explore Category</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-gaming-cyan" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
