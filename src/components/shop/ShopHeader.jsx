import { Link } from 'react-router-dom';

export default function ShopHeader({ totalProducts = 1248 }) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gaming-border">
      {/* Left side: Breadcrumb & Title */}
      <div className="text-left space-y-2">
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Link to="/" className="hover:text-gaming-cyan transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-gaming-cyan">Shop</span>
        </nav>
        
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none mt-2">
          Shop
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Discover the latest games and gaming consoles available to buy or rent.
        </p>
      </div>

      {/* Right side: Count info */}
      <div className="text-left md:text-right">
        <p className="text-sm text-slate-400">
          <span className="font-gaming font-extrabold text-white text-base mr-1 tracking-wider">
            {totalProducts.toLocaleString()}
          </span>
          Products Found
        </p>
      </div>
    </div>
  );
}
