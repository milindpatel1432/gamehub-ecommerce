import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'h-8 w-8', text = 'Loading operations...' }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-12">
      <Loader2 className={`${size} animate-spin text-gaming-cyan drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]`} />
      {text && (
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
          {text}
        </span>
      )}
    </div>
  );
}
