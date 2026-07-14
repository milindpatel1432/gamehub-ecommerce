import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-gaming-dark py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-gaming-border bg-gaming-card/40 p-8 md:p-12 lg:p-16 text-center"
        >
          {/* Subtle Ambient glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gaming-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Level Up Your Play
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Get early access to restocks, exclusive deals, and elite member rewards. No spam, just pure gaming news.
            </p>

            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md mx-auto pt-4"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 px-6 rounded-full bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                  />
                  <button
                    type="submit"
                    className="h-12 px-8 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,136,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Subscribe Now
                    <Send className="h-4 w-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-2 text-gaming-cyan pt-4"
                >
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                  <p className="font-semibold">Welcome to the elite rank! Check your inbox shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[11px] text-slate-600">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
