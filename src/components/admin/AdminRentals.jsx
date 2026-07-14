import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function AdminRentals() {
  const [rentals, setRentals] = useState([
    {
      id: 1,
      customer: 'Marcus Thorne',
      email: 'marcus@gamehub.com',
      title: 'Cyber Odyssey 2077',
      platform: 'PS5',
      endDate: 'Nov 1, 2026',
      daysRemaining: 7,
      status: 'Active',
    },
    {
      id: 2,
      customer: 'Aria Stark',
      email: 'aria@winterfell.com',
      title: 'Xbox Series X Console',
      platform: 'XBOX',
      endDate: 'Oct 20, 2026',
      daysRemaining: 0,
      status: 'Overdue',
    },
  ]);

  const handleReturn = (id) => {
    setRentals(
      rentals.map((r) => (r.id === id ? { ...r, status: 'Returned', daysRemaining: 0 } : r))
    );
    alert('Rental item marked as successfully returned!');
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-gaming-cyan" />
          Active Rentals Tracker
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-slate-300">
          <thead>
            <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2">Product Title</th>
              <th className="py-3 px-2">Platform</th>
              <th className="py-3 px-2">Return Date</th>
              <th className="py-3 px-2">Days Left</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-border/30">
            {rentals.map((rental) => (
              <tr key={rental.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-bold text-white">{rental.customer}</div>
                  <div className="text-[10px] text-slate-500">{rental.email}</div>
                </td>
                <td className="py-3 px-2 font-semibold text-white">{rental.title}</td>
                <td className="py-3 px-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gaming-cyan border border-gaming-cyan/30 rounded px-1.5 py-0.5">
                    {rental.platform}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-400">{rental.endDate}</td>
                <td className="py-3 px-2 font-bold">
                  {rental.status === 'Returned' ? (
                    <span className="text-slate-600">-</span>
                  ) : rental.status === 'Overdue' ? (
                    <span className="text-red-500">Overdue</span>
                  ) : (
                    <span className="text-gaming-cyan">{rental.daysRemaining} Days</span>
                  )}
                </td>
                <td className="py-3 px-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                    rental.status === 'Active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/25'
                      : rental.status === 'Returned'
                      ? 'bg-slate-500/10 text-slate-400 border-slate-500/25'
                      : 'bg-red-500/10 text-red-500 border-red-500/25 animate-pulse'
                  }`}>
                    {rental.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  {rental.status !== 'Returned' ? (
                    <button
                      onClick={() => handleReturn(rental.id)}
                      className="h-8 px-3 rounded-lg border border-gaming-cyan/60 hover:border-gaming-cyan bg-gaming-cyan/5 hover:bg-gaming-cyan/15 text-gaming-cyan font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Return Gear
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-600">Archived</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
