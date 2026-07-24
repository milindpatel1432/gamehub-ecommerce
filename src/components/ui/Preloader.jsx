import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import logo from '../../assets/images/logo.webp';

const LOADING_PHRASES = [
  'INITIALIZING GAMEHUB MATRIX...',
  'CONNECTING HIGH-SPEED PLAYSTATION & XBOX SERVERS...',
  'OPTIMIZING 4K 120FPS RAY-TRACING ASSETS...',
  'SYNCING AAA MARKETPLACE CATALOG...',
  'READY PLAYER ONE...',
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(() => {
    // Only show preloader once per browser session for smooth UX
    return !sessionStorage.getItem('gamehub_preloader_seen');
  });

  useEffect(() => {
    if (!isLoading) return;

    // Progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem('gamehub_preloader_seen', 'true');
          }, 400);
          return 100;
        }
        // Increment progress smoothly
        const step = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + step, 100);
      });
    }, 120);

    // Text ticker phrase changer
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0, 
          scale: 1.05,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
        }}
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-gaming-dark text-white select-none overflow-hidden"
      >
        {/* Background Ambient Glows & Cyber Grid */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gaming-cyan/15 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-gaming-accent/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        {/* Central HUD Loading Container */}
        <div className="relative w-full max-w-md px-6 text-center z-10">
          
          {/* Logo & Spinning Orbit Ring */}
          <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            
            {/* Outer Spinning Dual Neon Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-gaming-cyan border-r-gaming-accent shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-gaming-pink border-l-gaming-cyan opacity-60"
            />

            {/* Glowing Logo Circle */}
            <div className="w-20 h-20 rounded-2xl bg-gaming-black/90 border border-gaming-cyan/40 flex items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.5)] backdrop-blur-xl group">
              <img
                src={logo}
                alt="GameHub Logo"
                className="w-12 h-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,229,255,0.7)] animate-pulse"
              />
            </div>
          </div>

          {/* Brand Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1 mb-8"
          >
            <h1 className="font-gaming text-3xl font-black tracking-wider text-white">
              GAME<span className="text-gaming-cyan">HUB</span>
            </h1>
            <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gaming-cyan" /> AAA Gaming Marketplace
            </p>
          </motion.div>

          {/* Progress Bar & Percentage Pill */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-gaming-cyan animate-bounce" />
                SYSTEM BOOT
              </span>
              <span className="text-gaming-cyan text-sm tracking-wider font-gaming">
                {progress}%
              </span>
            </div>

            {/* Track Bar */}
            <div className="relative w-full h-2.5 rounded-full bg-gaming-black border border-gaming-cyan/30 p-0.5 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gaming-cyan via-blue-500 to-gaming-accent shadow-[0_0_15px_rgba(0,229,255,0.8)]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>
          </div>

          {/* Status Ticker Phrase */}
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase truncate"
            >
              {LOADING_PHRASES[phraseIndex]}
            </motion.p>
          </div>

          {/* Bottom Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-semibold uppercase border-t border-gaming-border/40 pt-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-gaming-cyan" /> Secure SSL
            </span>
            <span className="flex items-center gap-1">
              <Gamepad2 className="w-3 h-3 text-gaming-accent" /> 4K Ultra HD
            </span>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
