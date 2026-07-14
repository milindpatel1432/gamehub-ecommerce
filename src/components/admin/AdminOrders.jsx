import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    {
      id: 'GH-8392-491',
      customer: 'Marcus Thorne',
      email: 'marcus@gamehub.com',
      date: 'Oct 24, 2026',
      total: 603.38,
      status: 'Delivered',
      items: 'Cyber Odyssey 2077, PS5 Console',
    },
    {
      id: 'GH-7291-382',
      customer: 'Elena Rostova',
      email: 'elena@gamehub.com',
      date: 'Oct 10, 2026',
      total: 74.99,
      status: 'Shipped',
      items: 'Cosmos Pro Controller',
    },
    {
      id: 'GH-6180-271',
      customer: 'Tyler Durden',
      email: 'tyler@gamehub.com',
      date: 'Sep 15, 2026',
      total: 129.99,
      status: 'Delivered',
      items: 'Kraken Pro Elite V3',
    },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    alert(`Order ${orderId} status changed to ${newStatus}!`);
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4.5 w-4.5 text-gaming-cyan" />
          Customer Orders
        </h3>
      </div>

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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2 font-bold text-gaming-cyan">{order.id}</td>
                <td className="py-3 px-2">
                  <div className="font-bold text-white">{order.customer}</div>
                  <div className="text-[10px] text-slate-500">{order.email}</div>
                </td>
                <td className="py-3 px-2 text-slate-400">{order.date}</td>
                <td className="py-3 px-2 truncate max-w-[150px]">{order.items}</td>
                <td className="py-3 px-2 font-semibold text-white">${order.total.toFixed(2)}</td>
                <td className="py-3 px-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                    order.status === 'Delivered'
                      ? 'bg-green-500/10 text-green-400 border-green-500/25'
                      : order.status === 'Shipped'
                      ? 'bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/25'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="h-9 rounded-lg bg-gaming-black border border-gaming-border text-[10px] font-bold text-white px-2 focus:outline-none focus:border-gaming-cyan cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
