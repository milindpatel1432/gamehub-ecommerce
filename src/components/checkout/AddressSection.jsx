import { useState } from 'react';
import { MapPin, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressSection({ onAddressSelect }) {
  const [selectedId, setSelectedId] = useState(1);
  const [formExpanded, setFormExpanded] = useState(false);
  
  // New address state fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('United States');

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'Marcus Thorne',
      tag: 'HOME',
      street: '123 Neon Street, Sky-Tower 4',
      city: 'New City',
      postal: '10001',
      phone: '+1 (555) 000-1234',
    },
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !postal) return;

    const newAddr = {
      id: savedAddresses.length + 1,
      name: fullName,
      tag: 'OTHER',
      street,
      city,
      postal,
      phone,
    };

    setSavedAddresses([...savedAddresses, newAddr]);
    setSelectedId(newAddr.id);
    setFormExpanded(false);
    
    // Reset form fields
    setFullName('');
    setPhone('');
    setEmail('');
    setStreet('');
    setCity('');
    setPostal('');
  };

  const handleSelectAddress = (addr) => {
    setSelectedId(addr.id);
    if (onAddressSelect) {
      onAddressSelect(addr);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Saved Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-gaming font-extrabold text-white text-base uppercase tracking-wider">
          <MapPin className="h-5 w-5 text-gaming-cyan" />
          Saved Addresses
        </div>

        <div className="space-y-4">
          {savedAddresses.map((addr) => {
            const isSelected = selectedId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`rounded-2xl border bg-gaming-card/30 p-5 flex items-start gap-4 transition-all duration-300 cursor-pointer ${
                  isSelected ? 'border-gaming-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'border-gaming-border'
                }`}
              >
                {/* Radio Circle */}
                <div className="pt-1">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-gaming-cyan bg-gaming-cyan/15 text-gaming-cyan' : 'border-slate-500'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gaming-cyan shadow-[0_0_8px_rgba(0,229,255,0.8)]" />}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-base">{addr.name}</span>
                    <span className="text-[9px] font-bold border border-slate-600 text-slate-500 rounded px-1.5 py-0.5 uppercase">
                      {addr.tag}
                    </span>
                  </div>
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.postal}</p>
                  <p className="text-xs text-slate-500 pt-1">Phone: {addr.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-center">
                  <button className="h-10 px-6 rounded-lg bg-gaming-border hover:bg-gaming-border-active text-white text-xs font-bold transition-all cursor-pointer">
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAddress(addr);
                    }}
                    className="h-10 px-6 rounded-lg bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                  >
                    Deliver Here
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Address Accordion */}
      <div className="space-y-4 pt-4 border-t border-gaming-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-gaming font-extrabold text-white text-base uppercase tracking-wider">
            <Plus className="h-5 w-5 text-gaming-cyan" />
            Add New Address
          </div>
          <button
            onClick={() => setFormExpanded(!formExpanded)}
            className="text-xs font-semibold text-slate-500 hover:text-gaming-cyan transition-colors"
          >
            {formExpanded ? 'Collapse Form' : 'Expand Form'}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {formExpanded && (
            <motion.form
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSave}
              className="overflow-hidden rounded-2xl border border-gaming-border bg-gaming-card/20 p-6 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                  />
                </div>
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (000) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="gamer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="House number and street name"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* City */}
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                  />
                </div>
                {/* Postal Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="10001"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all"
                  />
                </div>
                {/* Country */}
                <div className="col-span-3 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-12 px-4 pr-10 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all appearance-none cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Submit Save Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="h-11 px-8 rounded-lg bg-gaming-border hover:bg-gaming-border-active text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Save Address
                </button>
              </div>

            </motion.form>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
