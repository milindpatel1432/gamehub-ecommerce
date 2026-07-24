import { motion } from 'framer-motion';
import { FileText, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gaming-dark text-slate-100 pb-20 overflow-hidden font-sans">
      
      {/* Hero Header */}
      <section className="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-gaming-border overflow-hidden bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-gaming-accent/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-4xl relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <FileText className="w-3.5 h-3.5 text-gaming-cyan" /> Terms of Service Agreement
          </div>

          <h1 className="font-gaming text-4xl sm:text-5xl font-black text-white leading-tight">
            Terms of <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent">Service</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Effective Date: July 2026. Please read these terms carefully before using GameHub services or renting gear.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8 glass-card rounded-3xl border border-gaming-border bg-gaming-card/40 p-8 sm:p-10 backdrop-blur-xl">
          
          {/* Section 1 */}
          <div className="space-y-3 border-b border-gaming-border/60 pb-6">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gaming-cyan" /> 1. Marketplace Accounts & Eligibility
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              By accessing GameHub, creating an account, or purchasing gaming gear, you represent that you are at least 18 years of age (or possess legal parental/guardian consent) and agree to abide by all platform rules and security requirements.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-b border-gaming-border/60 pb-6">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-gaming-cyan" /> 2. Hardware Rental & Security Deposit Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Console and VR headset rentals require a refundable security deposit. Rented equipment remains the sole property of GameHub Inc. Renters must return hardware in clean, undamaged condition at the conclusion of the agreed rental tenure.
            </p>
            <div className="p-4 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/30 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-gaming-cyan block">Deposit Refund Policy:</span>
              <p>
                Security deposits are processed back to the user's payment account within 2-4 business hours following doorstep physical inspection.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-b border-gaming-border/60 pb-6">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-gaming-cyan" /> 3. Warranty & Return Policy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All purchased brand-new gaming consoles and accessories come with official manufacturer warranty. Unopened physical game discs or equipment may be returned within 7 days of delivery for a full refund or exchange.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-gaming-cyan" /> 4. Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              GameHub Inc. shall not be held liable for any indirect, incidental, or consequential damages arising from third-party server downtime, game network outages (e.g. PlayStation Network, Xbox Live), or user misuse of rented hardware.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
