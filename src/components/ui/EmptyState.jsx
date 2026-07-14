import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No Records Found',
  description = 'There are no active records matching this view at the moment.',
  actionText = '',
  onAction = null,
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-gaming-border bg-gaming-card/20 space-y-5 text-left max-w-md mx-auto">
      {/* Icon frame */}
      <div className="p-4 rounded-full bg-gaming-black/45 border border-gaming-border text-slate-500">
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

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="h-10 px-6 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
