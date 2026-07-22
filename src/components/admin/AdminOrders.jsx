import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminOrders({ limit = null }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getOrders();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((order) => ({
          id: order._id,
          customer: order.user?.fullName || 'Guest Customer',
          email: order.user?.email || 'N/A',
          date: new Date(order.createdAt).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          total: order.total || 0,
          paymentStatus: order.paymentStatus || 'pending',
          status: order.status || 'Processing',
          items: order.items?.map((i) => i.title || i.product?.title || 'Gaming Item').join(', ') || 'Item',
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
    console.log(`[AdminOrders] Updating order ID: ${orderId} → ${newStatus}`);
    if (!orderId) {
      errorToast('Order ID is missing. Cannot update status.');
      return;
    }
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        successToast(`Order status updated to ${newStatus}!`);
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      } else {
        errorToast(res.message || 'Failed to update order status.');
      }
    } catch (err) {
      console.error('[AdminOrders] Status update error:', err);
      const msg = err.response?.data?.message || err.message || 'Error updating order status.';
      errorToast(msg);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' ||
      order.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const displayedOrders = limit ? filteredOrders.slice(0, limit) : filteredOrders;

  if (isLoading) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-5 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4.5 w-4.5 text-gaming-cyan" />
          Customer Orders Management
        </h3>

        {!limit && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 pl-8 pr-3 rounded-xl bg-gaming-black border border-gaming-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gaming-cyan"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            </div>

            {/* Status Filter */}
            <div className="relative flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-gaming-cyan" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 rounded-xl bg-gaming-black border border-gaming-border text-xs font-semibold text-white px-3 focus:outline-none focus:border-gaming-cyan cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Accepted">Accepted</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {displayedOrders.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">No orders match your filter criteria.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-slate-300">
            <thead>
              <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Payment</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gaming-border/30">
              {displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gaming-black/20 transition-colors">
                  <td className="py-3.5 px-2 font-bold text-gaming-cyan">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="py-3.5 px-2">
                    <div className="font-bold text-white">{order.customer}</div>
                    <div className="text-[10px] text-slate-500">{order.email}</div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-400 text-xs">{order.date}</td>
                  <td className="py-3.5 px-2 truncate max-w-[140px] text-xs" title={order.items}>{order.items}</td>
                  <td className="py-3.5 px-2 font-bold text-white">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
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
                  <td className="py-3.5 px-2 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-1.5 rounded-lg bg-gaming-black border border-gaming-border hover:border-gaming-cyan text-slate-300 hover:text-gaming-cyan transition-colors"
                      title="View Order Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <select
                      value={order.status}
                      disabled={order.status === 'Cancelled'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="h-8 rounded-lg bg-gaming-black border border-gaming-border text-[10px] font-bold text-white px-2 focus:outline-none focus:border-gaming-cyan cursor-pointer disabled:opacity-40"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
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
