import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How does renting work?',
      a: 'Select the rent option, select your duration, check out, and receive your console/disc. Inside the shipping box is a prepaid envelope. When done, slide the items in the envelope and drop it in the mail—no stamps or labels needed.',
    },
    {
      q: 'Can I buy the game after renting?',
      a: 'Absolutely! If you enjoy a game, you can choose to purchase it. The purchase price will deduct the rental fees you already paid, making it a seamless upgrade.',
    },
  ];

  return (
    <div className="w-full text-left space-y-4">
      <h3 className="font-gaming text-lg font-bold text-white tracking-wider">
        Common Questions
      </h3>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = idx === openIndex;
          return (
            <div key={idx} className="rounded-xl border border-gaming-border bg-gaming-card/40 overflow-hidden">
              {/* Question Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full h-14 px-5 flex items-center justify-between text-sm font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Answer content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-gaming-border/40 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
