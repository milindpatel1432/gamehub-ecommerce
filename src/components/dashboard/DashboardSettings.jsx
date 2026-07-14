import { useState } from 'react';
import { Settings, ShieldCheck, Mail, Globe, Shield } from 'lucide-react';

export default function DashboardSettings() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [privateProfile, setPrivateProfile] = useState(false);

  const handleUpdate = () => {
    alert('Preferences committed successfully!');
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 space-y-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gaming-cyan/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Settings className="h-4.5 w-4.5 text-gaming-cyan" />
          Settings
        </h3>
      </div>

      <div className="space-y-6 pt-2">
        {/* Toggle Theme */}
        <div className="flex items-center justify-between pb-4 border-b border-gaming-border/30">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white tracking-wide block">Console Dark Mode</span>
            <p className="text-[11px] text-slate-500">Apply dark futuristic neon visual styles.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkTheme}
              onChange={(e) => setDarkTheme(e.target.checked)}
              className="sr-only peer cursor-pointer"
            />
            <div className="w-11 h-6 bg-gaming-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-cyan peer-checked:after:bg-gaming-black"></div>
          </label>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between pb-4 border-b border-gaming-border/30">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white tracking-wide block flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              Email Notifications
            </span>
            <p className="text-[11px] text-slate-500">Receive receipt orders and rental period alerts.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer cursor-pointer"
            />
            <div className="w-11 h-6 bg-gaming-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-cyan peer-checked:after:bg-gaming-black"></div>
          </label>
        </div>

        {/* Privacy selection */}
        <div className="flex items-center justify-between pb-4 border-b border-gaming-border/30">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white tracking-wide block flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
              Private Profile Settings
            </span>
            <p className="text-[11px] text-slate-500">Hide game levels and rentals timeline from visitors.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privateProfile}
              onChange={(e) => setPrivateProfile(e.target.checked)}
              className="sr-only peer cursor-pointer"
            />
            <div className="w-11 h-6 bg-gaming-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-cyan peer-checked:after:bg-gaming-black"></div>
          </label>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white tracking-wide block flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              Display Language
            </span>
            <p className="text-[11px] text-slate-500">Choose dashboard language.</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 rounded-xl bg-gaming-black border border-gaming-border text-xs font-bold text-white px-4 cursor-pointer focus:outline-none focus:border-gaming-cyan"
          >
            <option value="en">English (US)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
          </select>
        </div>

        {/* Save button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleUpdate}
            className="h-11 px-8 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
