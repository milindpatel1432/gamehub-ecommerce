import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChoose() {
  const features = [
    {
      icon: ShieldCheck,
      title: '100% Certified',
      description: 'All games and consoles are factory-certified and guaranteed authentic.',
      iconColor: 'text-gaming-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,229,255,0.1)]',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day dispatch and ultra-fast shipping options globally.',
      iconColor: 'text-green-500',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    },
    {
      icon: RotateCcw,
      title: 'Easy Rentals',
      description: 'Flexible rental options and seamless subscriptions management.',
      iconColor: 'text-gaming-purple',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.1)]',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'Bank-grade encryption for all transactions and minimal security deposits.',
      iconColor: 'text-gaming-pink',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.1)]',
    },
  ];

  return (
    <section className="bg-gaming-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-gaming-border bg-gaming-card/40 hover:bg-gaming-card/70 hover:border-gaming-border-active transition-all duration-300"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-full border border-gaming-border/60 bg-gaming-black/60 flex items-center justify-center mb-5 ${feat.glow}`}>
                <feat.icon className={`h-7 w-7 ${feat.iconColor}`} />
              </div>

              {/* Title & Desc */}
              <h3 className="font-gaming text-base font-bold text-white tracking-wider mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
