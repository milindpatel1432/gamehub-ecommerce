import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Flame, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/images/hero_bg.png';

const DYNAMIC_TAGS = ['Spend Less.', 'Play PS5.', 'Rent Consoles.', 'Level Up.'];

export default function Hero() {
  const [tagIndex, setTagIndex] = useState(0);

  // Rotate dynamic text tag every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTagIndex((prev) => (prev + 1) % DYNAMIC_TAGS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gaming-black pt-20 pb-24 md:pb-32 lg:pb-40 border-b border-gaming-border">
      
      {/* Background Image with smooth gradient blending */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-right md:bg-right-bottom bg-no-repeat opacity-60 md:opacity-80 mix-blend-screen scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-black via-gaming-black/90 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-gaming-black via-transparent to-transparent z-0" />

      {/* Cyberpunk Ambient Neon Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gaming-cyan/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Scanning Laser Line Effect */}
      <motion.div
        animate={{ y: ['0%', '100%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-gaming-cyan/30 to-transparent pointer-events-none z-5"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl space-y-8 text-left">
          
          {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-gaming-cyan/40 bg-gaming-cyan/10 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-gaming-cyan uppercase shadow-[0_0_20px_rgba(0,229,255,0.2)] backdrop-blur-md"
            >
              <Flame className="h-4 w-4 text-gaming-cyan animate-bounce" />
              <span>24/7 Gaming Rentals & Sales</span>
              <span className="h-2 w-2 rounded-full bg-gaming-cyan animate-ping" />
            </motion.div>

            {/* Main Heading with Dynamic Rotating Tag */}
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-gaming text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
            >
              Play More. <br />
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={DYNAMIC_TAGS[tagIndex]}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.4 }}
                    className="inline-block bg-gradient-to-r from-gaming-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,229,255,0.5)]"
                  >
                    {DYNAMIC_TAGS[tagIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl font-medium"
            >
              Access the latest AAA blockbusters and next-gen consoles without the full price tag. Experience premium gaming through our flexible buy and rental programs.
            </motion.p>

            {/* Hero CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link
                to="/shop"
                className="group relative flex items-center justify-center gap-2.5 h-14 px-8 rounded-full bg-gaming-accent text-white font-extrabold text-sm tracking-wide shadow-[0_0_25px_rgba(0,136,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] hover:bg-gaming-cyan hover:text-gaming-black transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span>Buy Games</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/consoles"
                className="flex items-center justify-center h-14 px-8 rounded-full border-2 border-gaming-cyan/40 hover:border-gaming-cyan bg-gaming-card/50 hover:bg-gaming-card/90 text-white font-extrabold text-sm tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                Rent Consoles
              </Link>
            </motion.div>

            {/* Feature Highlights Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400 font-semibold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gaming-cyan shrink-0" />
                <span>Fast 24-48h Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gaming-cyan shrink-0" />
                <span>100% Refundable Deposit</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gaming-cyan shrink-0" />
                <span>Zero Maintenance Cost</span>
              </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
}
