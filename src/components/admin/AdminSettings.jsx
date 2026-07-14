import { useState } from 'react';
import { Settings, Shield, Mail, Globe, Server } from 'lucide-react';

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [smtpServer, setSmtpServer] = useState('smtp.gamehub.com');
  const [rentalTax, setRentalTax] = useState(8.5);
  const [depositFee, setDepositFee] = useState(15.0);

  const handleSave = (e) => {
    e.preventDefault();
    alert('System configurations saved successfully!');
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 space-y-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gaming-cyan/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Settings className="h-4.5 w-4.5 text-gaming-cyan" />
          System Console Configurations
        </h3>
      </div>

      <form onSubmit={handleSave} className="space-y-6 pt-2">
        
        {/* Toggle Maintenance Mode */}
        <div className="flex items-center justify-between pb-4 border-b border-gaming-border/30">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white tracking-wide block flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
              Maintenance Mode
            </span>
            <p className="text-[11px] text-slate-500">Block customer page views and trigger maintenance screens.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="sr-only peer cursor-pointer"
            />
            <div className="w-11 h-6 bg-gaming-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-cyan peer-checked:after:bg-gaming-black"></div>
          </label>
        </div>

        {/* SMTP Mail settings */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            SMTP Outgoing Server
          </label>
          <input
            type="text"
            value={smtpServer}
            onChange={(e) => setSmtpServer(e.target.value)}
            className="block h-12 w-full px-4 rounded-xl bg-gaming-black border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan"
          />
        </div>

        {/* Pricing variables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              System Tax rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={rentalTax}
              onChange={(e) => setRentalTax(parseFloat(e.target.value) || 0)}
              className="block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-slate-400" />
              Default Rental Deposit Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={depositFee}
              onChange={(e) => setDepositFee(parseFloat(e.target.value) || 0)}
              className="block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Trigger save button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="h-11 px-8 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-all cursor-pointer"
          >
            Save Admin System Settings
          </button>
        </div>

      </form>
    </div>
  );
}
