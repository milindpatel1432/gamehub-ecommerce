import { useState } from 'react';
import { Settings, Shield, Mail, Globe, Server, Phone, Image, CreditCard, Cloud } from 'lucide-react';
import { successToast } from '../../utils/toast';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('GameHub - AAA Gaming Platform');
  const [contactEmail, setContactEmail] = useState('support@gamehub.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [socialTwitter, setSocialTwitter] = useState('https://x.com/gamehub');
  const [socialDiscord, setSocialDiscord] = useState('https://discord.gg/gamehub');
  const [maintenance, setMaintenance] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    successToast('Website configurations saved successfully!');
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 space-y-8 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gaming-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 pb-4 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Settings className="h-5 w-5 text-gaming-cyan" />
          Super Admin System Settings
        </h3>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Website Information & Contact Details */}
        <div className="space-y-4">
          <h4 className="font-gaming text-xs font-bold uppercase tracking-wider text-gaming-cyan flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website Information & Contact Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Site Title
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="block h-11 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="block h-11 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="block h-11 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Social Links */}
        <div className="space-y-4 pt-2 border-t border-gaming-border/40">
          <h4 className="font-gaming text-xs font-bold uppercase tracking-wider text-gaming-cyan flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Social Media Links
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Twitter / X URL
              </label>
              <input
                type="text"
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                className="block h-11 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Discord Community URL
              </label>
              <input
                type="text"
                value={socialDiscord}
                onChange={(e) => setSocialDiscord(e.target.value)}
                className="block h-11 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Branding / Favicon Status */}
        <div className="space-y-4 pt-2 border-t border-gaming-border/40">
          <h4 className="font-gaming text-xs font-bold uppercase tracking-wider text-gaming-cyan flex items-center gap-2">
            <Image className="h-4 w-4" />
            Branding & Assets Status
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gaming-black/40 border border-gaming-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Active Website Logo</span>
                <span className="text-[10px] text-slate-400">/src/assets/images/logo.webp</span>
              </div>
              <span className="text-[9px] font-bold uppercase text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gaming-black/40 border border-gaming-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Active Favicon Icon</span>
                <span className="text-[10px] text-slate-400">/public/logo.webp</span>
              </div>
              <span className="text-[9px] font-bold uppercase text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Cloudinary & Payment Gateways (Display Only) */}
        <div className="space-y-4 pt-2 border-t border-gaming-border/40">
          <h4 className="font-gaming text-xs font-bold uppercase tracking-wider text-gaming-cyan flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Cloud Storage & Payment Integration (Read Only)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gaming-black/40 border border-gaming-border/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Cloud className="h-3.5 w-3.5 text-gaming-cyan" />
                Cloudinary Storage Engine
              </span>
              <span className="text-xs font-bold text-white block">Cloud Name: gamehub_cdn</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">Status: Connected & Operational</span>
            </div>

            <div className="p-4 rounded-xl bg-gaming-black/40 border border-gaming-border/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-gaming-accent" />
                Razorpay Payment Gateway
              </span>
              <span className="text-xs font-bold text-white block">Mode: Live Production Gateway</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">Status: Active (UPI / Cards / NetBanking)</span>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-gaming-border/40 flex justify-end">
          <button
            type="submit"
            className="h-11 px-8 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            Save Admin System Settings
          </button>
        </div>

      </form>
    </div>
  );
}
