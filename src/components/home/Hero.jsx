import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/images/hero_bg.png';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gaming-black pt-20 pb-28 md:pb-36 lg:pb-44 border-b border-gaming-border">
      
      {/* Background Image with overlay gradient to make it fade into dark on the left */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-right md:bg-right-bottom bg-no-repeat opacity-65 md:opacity-85 mix-blend-screen"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-black via-gaming-black/90 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-gaming-black via-transparent to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl space-y-8 text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gaming-cyan/40 bg-gaming-cyan/10 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wider text-gaming-cyan uppercase"
          >
            <Flame className="h-4 w-4 text-gaming-cyan animate-bounce" />
            24/7 Gaming Rentals
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-gaming text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none"
          >
            Play More. <br />
            <span className="text-[#b4c5ff] drop-shadow-[0_0_20px_rgba(180,197,255,0.4)]">
              Spend Less.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl"
          >
            Access the latest blockbusters and next-gen consoles without the full price tag. Experience premium gaming through our exclusive buy and rental programs.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <Link to="/shop" className="flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-gaming-accent text-white font-bold hover:bg-gaming-cyan hover:text-gaming-black hover:shadow-[0_0_25px_rgba(0,136,255,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
              Buy Games
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/shop" className="flex items-center justify-center h-14 px-8 rounded-full border-2 border-gaming-border hover:border-gaming-cyan bg-gaming-card/40 hover:bg-gaming-card/85 text-white font-bold hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all duration-300">
              Rent Consoles
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
