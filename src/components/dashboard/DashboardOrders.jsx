import { ShoppingBag, Eye } from 'lucide-react';

export default function DashboardOrders({ limit = null }) {
  const orders = [
    {
      id: 'GH-8392-491',
      date: 'Oct 24, 2026',
      total: 603.38,
      status: 'Delivered',
      items: ['Cyber Odyssey 2077', 'PS5 Console'],
    },
    {
      id: 'GH-7291-382',
      date: 'Oct 10, 2026',
      total: 74.99,
      status: 'Shipped',
      items: ['Cosmos Pro Controller'],
    },
    {
      id: 'GH-6180-271',
      date: 'Sep 15, 2026',
      total: 129.99,
      status: 'Delivered',
      items: ['Kraken Pro Elite V3'],
    },
  ];

  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60 justify-between">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4.5 w-4.5 text-gaming-cyan" />
          Recent Orders
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-slate-300">
          <thead>
            <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
              <th className="py-3 px-2">Order ID</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2">Items</th>
              <th className="py-3 px-2">Total</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-border/30">
            {displayedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2 font-bold text-gaming-cyan">{order.id}</td>
                <td className="py-3 px-2 text-slate-400">{order.date}</td>
                <td className="py-3 px-2 truncate max-w-[150px]">{order.items.join(', ')}</td>
                <td className="py-3 px-2 font-semibold text-white">${order.total.toFixed(2)}</td>
                <td className="py-3 px-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                    order.status === 'Delivered'
                      ? 'bg-green-500/10 text-green-400 border-green-500/25'
                      : 'bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/25'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
