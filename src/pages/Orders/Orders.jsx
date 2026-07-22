import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Eye, ChevronDown, CheckCircle2, Clock, Truck, XCircle, ArrowRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useCart } from '../../context/CartContext';
import { successToast } from '../../utils/toast';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function Orders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setError('Failed to retrieve your order history.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Error connecting to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Filter orders by search query and status filter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderNum = `GH-${order.id.slice(-4).toUpperCase()}`;
      const fullId = order.id.toLowerCase();
      const matchesSearch =
        orderNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullId.includes(searchQuery.toLowerCase()) ||
        order.items.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleBuyAgain = (order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id || item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        platform: item.platform,
        mode: item.mode,
      });
    });
    successToast(`Added ${order.items.length} item(s) to shopping cart!`);
    navigate('/cart');
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Delivered</span>
        </span>
      );
    }
    if (s === 'shipped') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Truck className="h-3.5 w-3.5" />
          <span>Shipped</span>
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="h-3.5 w-3.5" />
          <span>Cancelled</span>
        </span>
      );
    }
    // Processing / Pending
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="h-3.5 w-3.5" />
        <span>Processing</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-[#060914] min-h-screen text-slate-200 text-left font-sans flex flex-col py-10 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl w-full space-y-8 flex-grow">
        
        {/* ============================================================ */}
        {/* HEADER SECTION (Matching Reference UI)                       */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track and manage your recent hardware and game purchases.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Orders (Order #, Item name...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0b1329]/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORDERS LIST CONTAINER                                         */}
        {/* ============================================================ */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-28 rounded-2xl bg-slate-900/60 border border-slate-800" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12">
            <ErrorState
              title="Failed to Load Orders"
              description={error}
              onRetry={fetchOrders}
            />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon={ShoppingBag}
              title={searchQuery ? 'No Matching Orders' : 'No Orders Placed Yet'}
              description={
                searchQuery
                  ? 'No orders match your search criteria. Try a different order number or item name.'
                  : 'You have not placed any orders yet. Explore our shop to discover games and consoles!'
              }
              actionText="Browse Shop"
              onAction={() => navigate('/shop')}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.slice(0, visibleCount).map((order, index) => {
                const orderNumber = `ORDER #GH-${order.id.slice(-4).toUpperCase()}`;
                const firstItem = order.items[0];
                const extraItemsCount = order.items.length - 1;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group rounded-2xl border border-slate-800/80 bg-[#0b0f1d]/90 backdrop-blur-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700/90 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                  >
                    {/* Left Column: Order #, Date, Status */}
                    <div className="space-y-2 min-w-[180px]">
                      <span className="font-sans text-xs font-extrabold text-cyan-400 tracking-wider uppercase block">
                        {orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-medium block">
                        {formatDate(order.createdAt)}
                      </span>
                      <div className="pt-1">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Middle Column: Product Images Thumbnails */}
                    <div className="flex items-center gap-3">
                      {firstItem && (
                        <div className="relative w-14 h-14 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0 shadow-md">
                          <img
                            src={firstItem.image}
                            alt={firstItem.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Extra items overlay badge */}
                      {extraItemsCount > 0 && (
                        <div className="relative w-14 h-14 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center">
                          {order.items[1] && (
                            <img
                              src={order.items[1].image}
                              alt={order.items[1].title}
                              className="absolute inset-0 w-full h-full object-cover opacity-40 filter blur-[1px]"
                            />
                          )}
                          <span className="relative z-10 font-bold text-xs text-white bg-slate-950/80 px-2 py-1 rounded-md border border-slate-700">
                            +{extraItemsCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Amount & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-6 flex-1">
                      
                      {/* Total Amount */}
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Total Amount
                        </span>
                        <span className="font-sans text-xl sm:text-2xl font-extrabold text-white">
                          ₹{order.total.toFixed(2)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/orders/${order.id}`}
                          className="h-10 px-5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
                        >
                          View Details
                        </Link>

                        {order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Pending' ? (
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer flex items-center justify-center"
                          >
                            Track Order
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyAgain(order)}
                            className="h-10 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center"
                          >
                            Buy Again
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Show Older Orders Button */}
            {filteredOrders.length > visibleCount && (
              <div className="pt-6 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="h-12 px-8 rounded-xl border border-slate-800 bg-[#0d1428]/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Show older orders</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* FOOTER SECTION (Matching Reference UI)                      */}
      {/* ============================================================ */}
      <footer className="pt-16 pb-6 border-t border-slate-800/80 text-center space-y-4 mt-12">
        <div className="flex justify-center items-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Careers</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p className="text-[11px] text-slate-600">
          &copy; {new Date().getFullYear()} GameHub Elite. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
