import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Gamepad } from 'lucide-react';
import ShopHeader from '../../components/shop/ShopHeader';
import FilterSidebar from '../../components/shop/FilterSidebar';
import ProductCard from '../../components/shop/ProductCard';
import Pagination from '../../components/shop/Pagination';
import { productService } from '../../services/productService';
import SkeletonGrid from '../../components/ui/SkeletonGrid';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function Shop() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    platforms: [],
    types: [],
    transactions: [],
    categories: [],
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getAllProducts();
      if (res.success && Array.isArray(res.data)) {
        setAllProducts(res.data);
      } else {
        setError('Failed to retrieve products data.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page to 1 on filter update
  };

  // Filtered and Sorted Products logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((prod) => {
        // 1. Search filter by title
        if (searchQuery.trim() && !prod.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // 2. Platform filter
        if (filters.platforms && filters.platforms.length > 0) {
          const mapping = { ps5: 'PS5', ps4: 'PS4', xbox: 'XBOX' };
          const matched = filters.platforms.some((p) => prod.platform === mapping[p]);
          if (!matched) return false;
        }
        // 3. Product Type filter
        if (filters.types && filters.types.length > 0) {
          if (!filters.types.includes(prod.category)) return false;
        }
        // 4. Transaction Type filter
        if (filters.transactions && filters.transactions.length > 0) {
          const hasBuy = filters.transactions.includes('Buy') && prod.buyPrice !== null;
          const hasRent = filters.transactions.includes('Rent') && prod.rentPrice !== null;
          if (!hasBuy && !hasRent) return false;
        }
        // 5. Category filter using categories.js mapping
        if (filters.categories && filters.categories.length > 0) {
          const matchesCategory = filters.categories.some((catName) => {
            if (catName === 'PC Gaming') return prod.platform === 'PC';
            if (catName === 'Xbox Series X') return prod.platform === 'XBOX';
            if (catName === 'PlayStation 5') return prod.platform === 'PS5' || prod.category === 'Consoles';
            if (catName === 'Game CDs') return prod.category === 'Games';
            if (catName === 'Accessories') return prod.category === 'Hardware';
            return false;
          });
          if (!matchesCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.buyPrice - b.buyPrice;
        if (sortBy === 'price-high') return b.buyPrice - a.buyPrice;
        if (sortBy === 'popular') return b.reviews - a.reviews;
        // default 'newest'
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      });
  }, [allProducts, searchQuery, filters, sortBy]);

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || 'Newest Arrivals';

  return (
    <div className="w-full bg-gaming-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <ShopHeader totalProducts={filteredProducts.length} />

        {/* Toolbar: Search and Sort */}
        <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-gaming-card/25 border border-gaming-border">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search games, consoles, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gaming-cyan/60 transition-all"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative self-start md:self-auto flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">Sort By:</span>
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="h-12 px-5 rounded-xl border border-gaming-border bg-gaming-black/40 hover:bg-gaming-black/75 text-sm font-bold text-white flex items-center gap-6 transition-all cursor-pointer"
              >
                {currentSortLabel}
                <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 z-20 w-56 rounded-xl border border-gaming-border bg-gaming-card shadow-2xl p-2.5">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        sortBy === opt.value
                          ? 'bg-gaming-cyan text-gaming-black'
                          : 'text-slate-300 hover:bg-gaming-black/40 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filters Sidebar */}
          <FilterSidebar onFilterChange={handleFilterChange} />

          {/* Products List & Pagination */}
          <div className="flex-1 space-y-10 w-full">
            {isLoading ? (
              <SkeletonGrid count={6} />
            ) : error ? (
              <ErrorState 
                title="Failed to Load Products" 
                description={error} 
                onRetry={fetchProducts} 
              />
            ) : allProducts.length === 0 ? (
              <EmptyState
                icon={Gamepad}
                title="No Games Found"
                description="We couldn't find any products in our database. Please check back later."
              />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Gamepad}
                title="No Match Found"
                description="No products match your active search or filter criteria. Try adjusting your filters."
              />
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={12}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
