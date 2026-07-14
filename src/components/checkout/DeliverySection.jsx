import { useState } from 'react';
import { Truck, Sparkles } from 'lucide-react';

export default function DeliverySection({ onDeliverySelect }) {
  const [selectedId, setSelectedId] = useState('std');

  const methods = [
    {
      id: 'std',
      name: 'Standard Shipping',
      time: 'Delivers in 3-5 business days',
      price: 0,
      badge: 'Economy',
    },
    {
      id: 'exp',
      name: 'Express Shipping',
      time: 'Delivers in 1-2 business days',
      price: 15.00,
      badge: 'Super Fast',
    },
  ];

  const handleSelect = (method) => {
    setSelectedId(method.id);
    if (onDeliverySelect) {
      onDeliverySelect(method);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-2 font-gaming font-extrabold text-white text-base uppercase tracking-wider">
        <Truck className="h-5 w-5 text-gaming-cyan" />
        Choose Delivery Method
      </div>

      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = selectedId === method.id;
          return (
            <div
              key={method.id}
              onClick={() => handleSelect(method)}
              className={`rounded-2xl border bg-gaming-card/30 p-5 flex items-center justify-between gap-6 transition-all duration-300 cursor-pointer ${
                isSelected ? 'border-gaming-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'border-gaming-border'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Radio circle */}
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? 'border-gaming-cyan bg-gaming-cyan/15 text-gaming-cyan' : 'border-slate-500'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gaming-cyan" />}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-base">{method.name}</span>
                    <span className="text-[9px] font-bold border border-slate-600 text-slate-500 rounded px-1.5 py-0.5 uppercase">
                      {method.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{method.time}</p>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className={`text-base font-extrabold font-gaming tracking-wide ${
                  method.price === 0 ? 'text-green-500 font-sans font-bold text-sm uppercase' : 'text-white'
                }`}>
                  {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
