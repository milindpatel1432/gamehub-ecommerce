import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles } from 'lucide-react';
import { flashSale } from '../../data/banners';
import vrBundleImg from '../../assets/images/vr_bundle.png';

export default function FlashSale() {
  // Set target date to 2 days, 12 hours, 9 minutes from now for a live ticking timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 9,
    seconds: 0,
  });

  useEffect(() => {
    // Calculate final target time (in ms)
    const targetTime = Date.now() + (flashSale.targetDurationDays * 24 * 60 * 60 + flashSale.targetDurationHours * 60 * 60 + flashSale.targetDurationMinutes * 60) * 1000;

    const interval = setInterval(() => {
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  const timerItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section className="bg-gaming-dark py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-gaming-border bg-gradient-to-br from-gaming-card to-gaming-black p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Neon Purple and Cyan ambient glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-gaming-purple/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-gaming-cyan/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Content */}
          <div className="text-left space-y-6 max-w-xl z-10">
            {/* Promo Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3.5 py-1 text-xs font-bold text-red-400 tracking-wider uppercase">
              <Tag className="h-3.5 w-3.5" />
              Flash Sale
            </div>

            {/* Title */}
            <h2 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {flashSale.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {flashSale.description}
            </p>

            {/* Countdown timer */}
            <div className="flex items-center gap-4 sm:gap-6 pt-2">
              {timerItems.map((item, index) => (
                <div key={item.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl border border-gaming-border bg-gaming-black/85 flex items-center justify-center font-gaming text-xl sm:text-2xl font-bold text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                      {formatNumber(item.value)}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-2">
                      {item.label}
                    </span>
                  </div>
                  {index < timerItems.length - 1 && (
                    <span className="font-gaming text-xl sm:text-2xl font-bold text-gaming-cyan ml-4 sm:ml-6 mb-6">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Pricing / CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 line-through font-semibold">${flashSale.originalPrice.toFixed(2)}</span>
                <p className="text-3xl font-extrabold text-gaming-cyan font-gaming tracking-wide">
                  ${flashSale.salePrice.toFixed(2)}
                </p>
              </div>
              <button className="h-14 px-10 rounded-full bg-white hover:bg-gaming-cyan hover:text-gaming-black text-gaming-black font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Claim Offer
              </button>
            </div>
          </div>

          {/* Right Render Image */}
          <div className="relative z-10 w-full max-w-sm lg:max-w-md flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-gaming-purple/20 to-gaming-cyan/20 rounded-full blur-[60px] animate-pulse" />
            <motion.img
              src={vrBundleImg}
              alt="Master Elite VR Bundle"
              className="w-4/5 md:w-full object-contain drop-shadow-[0_15px_30px_rgba(0,136,255,0.25)] relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </div>

        </motion.div>
      </div>
    </section>
  );
}
