import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EMAIL_VALIDATION,
  PHONE_VALIDATION,
  NAME_VALIDATION,
  PIN_CODE_VALIDATION,
  REQUIRED_VALIDATION
} from '../../utils/validation';

export default function AddressSection({ onAddressSelect }) {
  const [selectedId, setSelectedId] = useState(1);
  const [formExpanded, setFormExpanded] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'Marcus Thorne',
      tag: 'HOME',
      street: '123 Neon Street, Sky-Tower 4',
      city: 'New City',
      postal: '100018', // 6 digits per spec
      phone: '1234567890',
    },
  ]);

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      street: '',
      city: '',
      postal: '',
      country: 'United States',
    },
  });

  // Focus fullName when form is expanded
  useEffect(() => {
    if (formExpanded) {
      setFocus('fullName');
    }
  }, [formExpanded, setFocus]);

  const onSubmitAddress = async (data) => {
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newAddr = {
      id: savedAddresses.length + 1,
      name: data.fullName.trim(),
      tag: 'OTHER',
      street: data.street.trim(),
      city: data.city.trim(),
      postal: data.postal,
      phone: data.phone,
    };

    setSavedAddresses([...savedAddresses, newAddr]);
    setSelectedId(newAddr.id);
    setFormExpanded(false);
    
    // Reset form fields
    reset();

    if (onAddressSelect) {
      onAddressSelect(newAddr);
    }
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
                  <button
                    type="button"
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
            type="button"
            onClick={() => setFormExpanded(!formExpanded)}
            className="text-xs font-semibold text-slate-500 hover:text-gaming-cyan transition-colors cursor-pointer"
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
              onSubmit={handleSubmit(onSubmitAddress)}
              className="overflow-hidden rounded-2xl border border-gaming-border bg-gaming-card/20 p-6 space-y-5"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full h-12 px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all ${
                      errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                    }`}
                    {...register('fullName', NAME_VALIDATION)}
                  />
                  {errors.fullName && (
                    <span id="fullName-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`w-full h-12 px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                    }`}
                    {...register('phone', PHONE_VALIDATION)}
                  />
                  {errors.phone && (
                    <span id="phone-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="gamer@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full h-12 px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                  }`}
                  {...register('email', EMAIL_VALIDATION)}
                />
                {errors.email && (
                  <span id="email-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  placeholder="House number and street name"
                  aria-invalid={!!errors.street}
                  aria-describedby={errors.street ? 'street-error' : undefined}
                  className={`w-full h-12 px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all ${
                    errors.street ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                  }`}
                  {...register('street', REQUIRED_VALIDATION('Street address'))}
                />
                {errors.street && (
                  <span id="street-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                    {errors.street.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* City */}
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    className={`w-full h-12 px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all ${
                      errors.city ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                    }`}
                    {...register('city', REQUIRED_VALIDATION('City'))}
                  />
                  {errors.city && (
                    <span id="city-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                      {errors.city.message}
                    </span>
                  )}
                </div>

                {/* Postal Code (6 digits Pin Code per spec) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">PIN / Postal Code</label>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    aria-invalid={!!errors.postal}
                    aria-describedby={errors.postal ? 'postal-error' : undefined}
                    className={`w-full h-12 px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all ${
                      errors.postal ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                    }`}
                    {...register('postal', PIN_CODE_VALIDATION)}
                  />
                  {errors.postal && (
                    <span id="postal-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                      {errors.postal.message}
                    </span>
                  )}
                </div>

                {/* Country */}
                <div className="col-span-3 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 px-4 pr-10 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 focus:outline-none focus:border-gaming-cyan/60 transition-all appearance-none cursor-pointer"
                      {...register('country', REQUIRED_VALIDATION('Country'))}
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
                  disabled={isSubmitting}
                  className="h-11 px-8 rounded-lg bg-gaming-border hover:bg-gaming-cyan hover:text-gaming-black text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                >
                  {isSubmitting ? 'Saving Address...' : 'Save Address'}
                </button>
              </div>

            </motion.form>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
