import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminOrders({ limit = null }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getOrders();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(order => ({
          id: order._id,
          customer: order.user?.fullName || 'Guest Customer',
          email: order.user?.email || 'N/A',
          date: new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          total: order.total,
          status: order.status,
          items: order.items.map(i => i.title || (i.product && i.product.title) || 'Gaming Item').join(', ')
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error(err);
      errorToast('Failed to load orders directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        successToast(`Order status updated to ${newStatus}!`);
        // Update local state
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        errorToast(res.message || 'Failed to update order status.');
      }
    } catch (err) {
      console.error(err);
      errorToast('Error updating order status.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4.5 w-4.5 text-gaming-cyan" />
          Customer Orders
        </h3>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-500 py-4">No customer orders placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-slate-300">
            <thead>
              <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Purchased Items</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gaming-border/30">
              {displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gaming-black/20 transition-colors">
                  <td className="py-3 px-2 font-bold text-gaming-cyan">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-2">
                    <div className="font-bold text-white">{order.customer}</div>
                    <div className="text-[10px] text-slate-500">{order.email}</div>
                  </td>
                  <td className="py-3 px-2 text-slate-400">{order.date}</td>
                  <td className="py-3 px-2 truncate max-w-[150px]" title={order.items}>{order.items}</td>
                  <td className="py-3 px-2 font-semibold text-white">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                      order.status === 'Delivered'
                        ? 'bg-green-500/10 text-green-400 border-green-500/25'
                        : order.status === 'Shipped'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                        : order.status === 'Cancelled'
                        ? 'bg-red-500/10 text-red-400 border-red-500/25'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <select
                      value={order.status}
                      disabled={order.status === 'Cancelled'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="h-9 rounded-lg bg-gaming-black border border-gaming-border text-[10px] font-bold text-white px-2 focus:outline-none focus:border-gaming-cyan cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
