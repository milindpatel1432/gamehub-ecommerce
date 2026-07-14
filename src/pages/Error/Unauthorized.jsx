import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="w-full bg-gaming-dark min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md rounded-3xl border border-red-500/25 bg-gaming-card/45 p-8 text-center space-y-6 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Huge icon block */}
        <div className="flex justify-center">
          <div className="p-5 rounded-full bg-gaming-black/60 border border-red-500/35 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse">
            <span className="font-gaming text-5xl font-extrabold tracking-widest block leading-none">403</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-gaming text-xl font-bold text-white tracking-wider uppercase flex items-center justify-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Access Denied
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your clearance level is insufficient to access these systems logs. Access denied by platform security rules.
          </p>
        </div>

        {/* Navigation Action CTA triggers */}
        <div className="pt-2">
          <Link
            to="/"
            className="w-full h-11 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
