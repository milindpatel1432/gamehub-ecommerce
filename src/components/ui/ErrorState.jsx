import { ShieldAlert, RefreshCw } from 'lucide-react';
import { errorToast } from '../../utils/toast';

export default function ErrorState({
  icon: Icon = ShieldAlert,
  title = 'System Offline',
  description = 'An error occurred while loading this view section. Please try again.',
  retryText = 'Retry Action',
  onRetry = null,
}) {
  const handleRetry = () => {
    errorToast('Retry failed. Something went wrong. Please check your connection.');
    if (onRetry) {
      onRetry();
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-red-500/25 bg-red-500/5 space-y-5 text-left max-w-md mx-auto">
      {/* Icon frame */}
      <div className="p-4 rounded-full bg-gaming-black/60 border border-red-500/35 text-red-500 animate-pulse">
        <Icon className="h-7 w-7" />
      </div>

      <div className="space-y-1.5">
        <h4 className="font-gaming text-sm font-bold text-white tracking-wider uppercase">
          {title}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={handleRetry}
          className="h-10 px-6 rounded-full border border-red-500/35 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {retryText}
        </button>
      )}
    </div>
  );
}
