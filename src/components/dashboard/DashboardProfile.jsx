import { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Marcus Thorne',
    email: user?.email || 'marcus@gamehub.com',
    phone: user?.phone || '+1 (555) 000-1234',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Simulated profile update saved successfully!');
  };

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 md:p-8 space-y-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gaming-cyan/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 pb-2 border-b border-gaming-border/60">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-gaming-cyan" />
          My Profile
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
        {/* Avatar badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border border-gaming-cyan bg-gaming-cyan/10 flex items-center justify-center font-gaming text-3xl font-extrabold text-gaming-cyan shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            {formData.fullName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gaming-cyan text-gaming-black">
            <Sparkles className="h-3 w-3 animate-spin-slow" />
          </span>
        </div>
        
        <div className="text-center sm:text-left">
          <h4 className="font-gaming text-lg font-bold text-white tracking-wide">{formData.fullName}</h4>
          <span className="text-[10px] text-gaming-cyan font-bold uppercase tracking-widest bg-gaming-cyan/10 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-gaming-cyan/20">
            Elite Tier Pro
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 disabled:opacity-50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            disabled={!isEditing}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 disabled:opacity-50 transition-all"
          />
        </div>

        <div className="pt-2 flex justify-end">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-10 px-6 rounded-full border border-gaming-border hover:border-white text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 px-6 rounded-full border border-gaming-cyan/60 hover:border-gaming-cyan bg-gaming-cyan/5 hover:bg-gaming-cyan/10 text-gaming-cyan font-bold text-xs transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
