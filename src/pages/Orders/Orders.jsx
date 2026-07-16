import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { orderService } from '../../services/orderService';
import SkeletonGrid from '../../components/ui/SkeletonGrid';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error(err);
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full bg-gaming-dark py-12 px-4 sm:px-6 lg:px-8 min-h-[75vh] text-slate-200">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
          <Link to="/" className="hover:text-gaming-cyan transition-colors">Home</Link>
          <span>&gt;</span>
          <Link to="/dashboard" className="hover:text-gaming-cyan transition-colors">Dashboard</Link>
          <span>&gt;</span>
          <span className="text-gaming-cyan">My Orders</span>
        </nav>

        {/* Header */}
        <div className="text-left pb-6 border-b border-gaming-border">
          <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
            My Orders <span className="text-sm font-semibold text-slate-500 lowercase ml-2">({orders.length} orders)</span>
          </h1>
        </div>

        {isLoading ? (
          <div className="py-8">
            <SkeletonGrid count={3} />
          </div>
        ) : error ? (
          <div className="py-12">
            <ErrorState
              title="Failed to Load Orders"
              description={error}
              onRetry={fetchOrders}
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={ShoppingBag}
              title="No Orders Placed Yet"
              description="You have not placed any orders. Go to the shop to buy or rent games!"
              actionText="Browse Shop"
              onAction={() => navigate('/shop')}
            />
          </div>
        ) : (
          /* Orders Table/List view */
          <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 space-y-6 text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left text-slate-300">
                <thead>
                  <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
                    <th className="py-3.5 px-3">Order ID</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3">Items Count</th>
                    <th className="py-3.5 px-3">Payment Method</th>
                    <th className="py-3.5 px-3">Grand Total</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gaming-border/30">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gaming-black/20 transition-colors">
                      <td className="py-4 px-3 font-bold text-gaming-cyan font-gaming">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-4 px-3 text-slate-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-3">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="py-4 px-3 uppercase text-slate-400">
                        {order.paymentMethod}
                      </td>
                      <td className="py-4 px-3 font-semibold text-white font-gaming">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2.5 py-1 border ${
                          order.status === 'Delivered'
                            ? 'bg-green-500/10 text-green-400 border-green-500/25'
                            : order.status === 'Cancelled'
                            ? 'bg-red-500/10 text-red-400 border-red-500/25'
                            : order.status === 'Shipped'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                            : 'bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/25'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 text-gaming-cyan hover:text-white transition-colors font-bold text-xs cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
