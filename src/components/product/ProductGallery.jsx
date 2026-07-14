import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rotate3d } from 'lucide-react';

export default function ProductGallery() {
  const images = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full space-y-4">
      {/* Large Main Display */}
      <div className="relative h-[300px] sm:h-[450px] rounded-3xl border border-gaming-border bg-gaming-black/20 overflow-hidden">
        
        {/* 360 View Badge */}
        <div className="absolute top-4 left-4 z-10">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/45 text-gaming-cyan text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] hover:bg-gaming-cyan hover:text-gaming-black transition-all cursor-pointer">
            <Rotate3d className="h-4.5 w-4.5 animate-spin-slow" />
            360° View
          </button>
        </div>

        {/* Fading active image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            alt="Product Preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => {
          const isActive = idx === activeIndex;
          const isLast = idx === images.length - 1;

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 sm:h-24 rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                isActive ? 'border-gaming-cyan shadow-[0_0_12px_rgba(0,229,255,0.3)] scale-98' : 'border-gaming-border/80 hover:border-gaming-cyan/40'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              
              {/* Special "+12" overlay on last thumbnail */}
              {isLast && (
                <div className="absolute inset-0 bg-gaming-black/70 flex items-center justify-center">
                  <span className="font-gaming font-extrabold text-sm sm:text-base text-white tracking-wider">
                    +12
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
