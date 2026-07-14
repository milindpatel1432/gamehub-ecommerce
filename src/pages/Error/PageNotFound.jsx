import { Link } from 'react-router-dom';
import { HelpCircle, Home, Gamepad } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="w-full bg-gaming-dark min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gaming-border bg-gaming-card/45 p-8 text-center space-y-6 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gaming-cyan/5 rounded-full blur-2xl pointer-events-none" />

        {/* Huge icon block */}
        <div className="flex justify-center">
          <div className="p-5 rounded-full bg-gaming-black/60 border border-gaming-cyan/30 text-gaming-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <span className="font-gaming text-5xl font-extrabold tracking-widest block leading-none">404</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-gaming text-xl font-bold text-white tracking-wider uppercase flex items-center justify-center gap-2">
            <HelpCircle className="h-5 w-5 text-gaming-cyan" />
            Page Not Found
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The coordinates you were traversing are either corrupted or offline. Please navigate back to base.
          </p>
        </div>

        {/* Navigation Action CTA triggers */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            to="/"
            className="flex-1 h-11 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            to="/shop"
            className="flex-1 h-11 rounded-full border border-gaming-border hover:border-gaming-cyan/60 bg-gaming-black/20 hover:bg-gaming-cyan/5 text-slate-300 hover:text-gaming-cyan font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Gamepad className="h-4 w-4" />
            Browse Games
          </Link>
        </div>
      </div>
    </div>
  );
}
