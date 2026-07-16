import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'rental', label: 'Rental Terms' },
    { id: 'reviews', label: 'Reviews (1.2k)' },
  ];

  return (
    <div className="w-full text-left space-y-6 pt-6">
      {/* Tabs list header */}
      <div className="flex border-b border-gaming-border pb-px overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 text-sm font-semibold tracking-wide border-b-2 whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-gaming-cyan text-gaming-cyan'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels content */}
      <div className="min-h-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-slate-300 text-sm leading-relaxed"
          >
            {activeTab === 'description' && (
              <p>
                {product?.description || "No description available."}
              </p>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-md pt-2">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Publisher/Brand</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.brand || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Genre/Category</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.category || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Platforms</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.platform || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Condition</span>
                  <p className="text-sm font-bold text-white mt-0.5">{product?.condition || 'N/A'}</p>
                </div>
              </div>
            )}

            {activeTab === 'rental' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-gaming-border bg-gaming-card/30">
                  <h5 className="font-gaming text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Security Deposit
                  </h5>
                  <p className="text-xs text-slate-400">
                    A fully-refundable deposit of $40.00 is required atcheckout. This is fully returned once the physical disc/console is returned.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-gaming-border bg-gaming-card/30">
                  <h5 className="font-gaming text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Delivery & Returns
                  </h5>
                  <p className="text-xs text-slate-400">
                    Pre-paid return shipping envelopes are included. Just drop the item in any local mailbox when your rental duration expires.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 pt-2">
                {[
                  { name: 'Elena R.', rating: 5, date: '1 day ago', text: 'Stunning graphics on PS5! The RPG depth is incredible and cybernetic upgrades are very fun.' },
                  { name: 'David M.', rating: 4, date: '3 days ago', text: 'Brilliant soundtrack and world design. Ran into a few minor bugs but totally worth playing.' },
                ].map((rev, i) => (
                  <div key={i} className="border-b border-gaming-border/60 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{rev.name}</span>
                      <span className="text-xs text-slate-500">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
