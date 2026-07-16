import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function DashboardOrders({ limit = null }) {
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
        console.error(err);
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
      day: 'numeric',
      year: 'numeric',
    });
  };

  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60 justify-between">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4.5 w-4.5 text-gaming-cyan" />
          Recent Orders
        </h3>
        {orders.length > 0 && limit && (
          <Link to="/orders" className="text-xs text-gaming-cyan hover:text-white transition-colors font-bold">
            View All
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-500 py-4">No orders placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-slate-300">
            <thead>
              <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gaming-border/30">
              {displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gaming-black/20 transition-colors">
                  <td className="py-3 px-2 font-bold text-gaming-cyan">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-2 text-slate-400">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-2 truncate max-w-[150px]">
                    {order.items.map((i) => i.title).join(', ')}
                  </td>
                  <td className="py-3 px-2 font-semibold text-white">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                      order.status === 'Delivered'
                        ? 'bg-green-500/10 text-green-400 border-green-500/25'
                        : order.status === 'Cancelled'
                        ? 'bg-red-500/10 text-red-400 border-red-500/25'
                        : 'bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/25'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-gaming-cyan hover:text-white transition-colors font-bold text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
