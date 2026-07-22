import { useState, useEffect } from 'react';
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
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search Debounce States
  const [searchVal, setSearchVal] = useState('');
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

  // Debounce search query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    // Build API query parameters
    const queryParams = {
      page: currentPage,
      limit: 9,
      sort: sortBy === 'price-low' ? 'price-asc' : sortBy === 'price-high' ? 'price-desc' : sortBy === 'popular' ? 'rating' : 'newest',
    };

    if (searchQuery.trim()) {
      queryParams.search = searchQuery;
    }

    // Platforms mapping
    if (filters.platforms && filters.platforms.length > 0) {
      const platformMapping = { ps5: 'PS5', ps4: 'PS4', xbox: 'XBOX' };
      queryParams.platform = platformMapping[filters.platforms[0]];
    }

    // Category types mapping
    if (filters.types && filters.types.length > 0) {
      queryParams.category = filters.types[0];
    }

    // Transaction type mapping (Buy vs Rent)
    if (filters.transactions && filters.transactions.length > 0) {
      if (filters.transactions.includes('Buy') && !filters.transactions.includes('Rent')) {
        queryParams.rentalAvailable = 'false';
      } else if (filters.transactions.includes('Rent') && !filters.transactions.includes('Buy')) {
        queryParams.rentalAvailable = 'true';
      }
    }

    // Custom category filter mapping
    if (filters.categories && filters.categories.length > 0) {
      queryParams.category = filters.categories[0];
    }

    try {
      const res = await productService.getAllProducts(queryParams);
      const productsList = res?.data || [];
      setProducts(Array.isArray(productsList) ? productsList : []);
      setTotalProducts(res?.totalProducts || 0);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger load on state adjustments
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, searchQuery, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

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
        <ShopHeader totalProducts={totalProducts} />

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
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
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
                        setCurrentPage(1);
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
            ) : products.length === 0 ? (
              <EmptyState
                icon={Gamepad}
                title="No Match Found"
                description="No products match your active search or filter criteria. Try adjusting your filters."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
