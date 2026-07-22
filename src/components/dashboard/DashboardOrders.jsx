import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useCart } from '../../context/CartContext';
import { successToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function DashboardOrders({ limit = null }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders();
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
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
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="h-3.5 w-3.5" />
        <span>Processing</span>
      </span>
    );
  };

  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 bg-[#0b0f1d]/80 rounded-2xl border border-slate-800">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="font-sans text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-cyan-400" />
          My Orders
        </h3>
        {orders.length > 0 && limit && (
          <Link to="/orders" className="text-xs text-cyan-400 hover:underline font-bold">
            View All &rarr;
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0b0f1d]/40">
          <p className="text-sm text-slate-500 font-semibold">No orders placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order, index) => {
            const orderNumber = `ORDER #GH-${order.id.slice(-4).toUpperCase()}`;
            const firstItem = order.items[0];
            const extraItemsCount = order.items.length - 1;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="group rounded-2xl border border-slate-800/80 bg-[#0b0f1d]/90 backdrop-blur-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-700 transition-all shadow-lg"
              >
                {/* Left: Order Info */}
                <div className="space-y-1.5 min-w-[160px]">
                  <span className="text-xs font-extrabold text-cyan-400 tracking-wider block">
                    {orderNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block">
                    {formatDate(order.createdAt)}
                  </span>
                  <div className="pt-1">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Center: Image Thumbnails */}
                <div className="flex items-center gap-3">
                  {firstItem && (
                    <div className="relative w-12 h-12 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0">
                      <img src={firstItem.image} alt={firstItem.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {extraItemsCount > 0 && (
                    <div className="relative w-12 h-12 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold text-xs text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                        +{extraItemsCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 flex-1">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount</span>
                    <span className="font-sans text-xl font-extrabold text-white">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      to={`/orders/${order.id}`}
                      className="h-9 px-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/60 text-slate-200 text-xs font-semibold flex items-center justify-center transition-all"
                    >
                      View Details
                    </Link>
                    {order.status === 'Processing' || order.status === 'Shipped' ? (
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
                      >
                        Track Order
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyAgain(order)}
                        className="h-9 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
