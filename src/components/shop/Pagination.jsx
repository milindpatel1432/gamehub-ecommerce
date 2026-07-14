import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 12, onPageChange }) {
  const pages = [1, 2, 3, '...', totalPages];

  return (
    <div className="w-full flex items-center justify-center gap-2.5 pt-8 border-t border-gaming-border/50">
      
      {/* Prev Arrow */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        className="w-10 h-10 rounded-xl border border-gaming-border bg-gaming-card hover:bg-gaming-accent hover:border-gaming-accent text-white flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-500 font-bold">
              ...
            </span>
          );
        }

        const isActive = currentPage === page;

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange && onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-gaming font-extrabold text-sm flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-gaming-cyan text-gaming-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'border border-gaming-border bg-gaming-card/40 text-slate-400 hover:border-gaming-border-active hover:text-white'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Arrow */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        className="w-10 h-10 rounded-xl border border-gaming-border bg-gaming-card hover:bg-gaming-accent hover:border-gaming-accent text-white flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

    </div>
  );
}
