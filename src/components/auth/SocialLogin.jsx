export default function SocialLogin() {
  return (
    <div className="space-y-4">
      {/* Separator line */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gaming-border/60"></div>
        </div>
        <span className="relative px-3 bg-gaming-card/45 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
          Or Continue With
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Google button */}
        <button
          type="button"
          onClick={() => alert('Simulated Google Authentication Sign-In')}
          className="h-11 rounded-xl border border-gaming-border hover:border-gaming-cyan/50 bg-gaming-black/20 hover:bg-gaming-cyan/5 text-slate-300 hover:text-gaming-cyan font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.63 0 3.11.624 4.228 1.636l3.055-3.055C18.665 2.062 15.6 1 12.24 1 6.033 1 12.24 6.033 12.24 12.24s5.033 11.24 11.24 11.24c5.858 0 11.026-4.204 11.026-11.24 0-.712-.06-1.402-.178-2.072H12.24z"/>
          </svg>
          Google
        </button>

        {/* Apple button */}
        <button
          type="button"
          onClick={() => alert('Simulated Apple Authentication Sign-In')}
          className="h-11 rounded-xl border border-gaming-border hover:border-white bg-gaming-black/20 hover:bg-white/5 text-slate-300 hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
        >
          <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.95.83-.02 1.98-.6 2.84-1.34z"/>
          </svg>
          Apple
        </button>
      </div>
    </div>
  );
}
