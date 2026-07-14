import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="w-full min-h-[85vh] bg-gaming-dark flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gaming-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg rounded-3xl border border-gaming-border bg-gaming-card/45 p-8 md:p-10 text-left shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-sm relative z-10"
      >
        {/* Title */}
        <div className="space-y-2 mb-8 text-center sm:text-left">
          <h2 className="font-gaming text-3xl font-extrabold text-white tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </motion.div>
    </div>
  );
}
