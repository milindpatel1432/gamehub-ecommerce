import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, Database, Server, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gaming-dark text-slate-100 pb-20 overflow-hidden font-sans">
      
      {/* Hero Header */}
      <section className="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-gaming-border overflow-hidden bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gaming-cyan/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-4xl relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Lock className="w-3.5 h-3.5 text-gaming-cyan" /> Data Protection Assurance
          </div>

          <h1 className="font-gaming text-4xl sm:text-5xl font-black text-white leading-tight">
            Privacy <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent">Policy</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Last Updated: July 2026. Learn how GameHub protects, processes, and respects your personal data.
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8 glass-card rounded-3xl border border-gaming-border bg-gaming-card/40 p-8 sm:p-10 backdrop-blur-xl">
          
          {/* Section 1 */}
          <div className="space-y-3 border-b border-gaming-border/60 pb-6">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gaming-cyan" /> 1. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When you register a GameHub account, place an order, rent console hardware, or request support, we collect information including your name, email address, phone number, shipping address, and payment confirmation tokens.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-b border-gaming-border/60 pb-6">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-gaming-cyan" /> 2. How We Use Your Data
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your personal data is strictly utilized to process transactions, dispatch hardware rentals, conduct digital KYC verification for high-value console rentals, prevent fraudulent orders, and provide 24/7 gamer customer support.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> End-to-end encrypted payment processing via Razorpay & Stripe.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> We NEVER sell or trade your personal information to third-party advertisers.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-b border-gaming-border/60 pb-6">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-gaming-cyan" /> 3. Data Security & Storage
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              GameHub uses bank-grade 256-bit SSL encryption for data transmission. All user profiles and order histories are stored on secured, ISO-27001 compliant cloud servers with continuous threat monitoring.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-gaming-cyan" /> 4. Your Privacy Rights
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have the full right to access, export, or request deletion of your personal account data at any time by contacting our Data Protection Officer at <span className="text-gaming-cyan font-bold">privacy@gamehub.com</span>.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
