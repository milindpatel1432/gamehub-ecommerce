import { Calendar, ShieldCheck, Activity } from 'lucide-react';

export default function DashboardRentals() {
  const rentals = [
    {
      id: 1,
      title: 'Cyber Odyssey 2077',
      platform: 'PS5',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
      rentalStart: 'Oct 25, 2026',
      endDate: 'Nov 1, 2026',
      daysRemaining: 7,
      status: 'Active',
    },
  ];

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-gaming-cyan" />
          Active Rentals
        </h3>
      </div>

      <div className="space-y-4">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-gaming-black/20 border border-gaming-border/40"
          >
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gaming-black/25 flex-shrink-0">
                <img src={rental.image} alt={rental.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{rental.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{rental.platform} Edition</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex items-center justify-between sm:justify-end gap-6 text-right text-xs">
              <div className="space-y-0.5 text-left sm:text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Rental Start</span>
                <span className="font-semibold text-slate-400">{rental.rentalStart}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Rental End</span>
                <span className="font-semibold text-white">{rental.endDate}</span>
              </div>
              <div className="space-y-0.5 text-left sm:text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Remaining</span>
                <span className="font-bold text-gaming-cyan">{rental.daysRemaining} Days</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Status</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/25 rounded px-2.5 py-0.5 inline-block">
                  {rental.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
