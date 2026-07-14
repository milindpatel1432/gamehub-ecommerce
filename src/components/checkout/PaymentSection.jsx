import { useState } from 'react';
import { CreditCard, Landmark, Wallet, DollarSign, Send, ShieldAlert } from 'lucide-react';

export default function PaymentSection({ onPaymentSelect }) {
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Form states for Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Form states for UPI
  const [upiId, setUpiId] = useState('');

  const methods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: Send },
    { id: 'banking', name: 'Net Banking', icon: Landmark },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet },
    { id: 'cod', name: 'Cash on Delivery', icon: DollarSign },
  ];

  const handleSelect = (methodId) => {
    setSelectedMethod(methodId);
    if (onPaymentSelect) {
      onPaymentSelect({ type: methodId });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-2 font-gaming font-extrabold text-white text-base uppercase tracking-wider">
        <CreditCard className="h-5 w-5 text-gaming-cyan" />
        Select Payment Method
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Payment Method Options List */}
        <div className="md:col-span-1 flex flex-col gap-2.5">
          {methods.map((method) => {
            const isSelected = method.id === selectedMethod;
            const IconComp = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id)}
                className={`h-12 px-4 rounded-xl border text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-gaming-cyan bg-gaming-cyan/10 text-gaming-cyan shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                    : 'border-gaming-border bg-gaming-card/30 text-slate-400 hover:border-gaming-border-active hover:text-white'
                }`}
              >
                <IconComp className="h-4.5 w-4.5" />
                {method.name}
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Payment Form details */}
        <div className="md:col-span-2 rounded-2xl border border-gaming-border bg-gaming-card/20 p-6">
          
          {/* Card Form */}
          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Card Information
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                />
              </div>
            </div>
          )}

          {/* UPI Form */}
          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                UPI Address
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. gamer@okaxis)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60"
                />
                <p className="text-[10px] text-slate-500 leading-normal">
                  A payment request will be sent to your UPI app. Please approve within 5 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Net Banking Options */}
          {selectedMethod === 'banking' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Select Bank
              </h4>
              <div className="relative">
                <select className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 appearance-none cursor-pointer">
                  <option>Chase Bank</option>
                  <option>Bank of America</option>
                  <option>Wells Fargo</option>
                  <option>CitiBank</option>
                </select>
              </div>
            </div>
          )}

          {/* Wallets */}
          {selectedMethod === 'wallet' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Select Wallet Service
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {['PayPal', 'Apple Pay', 'Google Pay', 'Venmo'].map((wallet) => (
                  <button
                    key={wallet}
                    className="h-12 rounded-xl border border-gaming-border bg-gaming-black/40 hover:bg-gaming-cyan/5 hover:border-gaming-cyan/60 text-xs font-bold text-slate-300 hover:text-gaming-cyan transition-all cursor-pointer"
                  >
                    {wallet}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cash on Delivery */}
          {selectedMethod === 'cod' && (
            <div className="space-y-3">
              <div className="flex gap-3 text-amber-500">
                <ShieldAlert className="h-5.5 w-5.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Terms apply
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Cash payment must be made upon package arrival. Please keep exact change ready.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
