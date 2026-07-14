import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { successToast } from '../../utils/toast';
import {
  EMAIL_VALIDATION,
  PHONE_VALIDATION,
  NAME_VALIDATION,
  REQUIRED_VALIDATION
} from '../../utils/validation';

export default function DashboardProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  // Focus fullName on toggling edit mode
  useEffect(() => {
    if (isEditing) {
      setFocus('fullName');
    }
  }, [isEditing, setFocus]);

  // Keep form synced with user updates
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    // Simulated short delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateProfile(data);
    setIsEditing(false);
    successToast('Profile updated successfully!');
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
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'G'}
          </div>
          <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gaming-cyan text-gaming-black">
            <Sparkles className="h-3 w-3 animate-spin-slow" />
          </span>
        </div>
        
        <div className="text-center sm:text-left">
          <h4 className="font-gaming text-lg font-bold text-white tracking-wide">{user?.fullName || 'Marcus Thorne'}</h4>
          <span className="text-[10px] text-gaming-cyan font-bold uppercase tracking-widest bg-gaming-cyan/10 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-gaming-cyan/20">
            Elite Tier Pro
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={`block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-50 ${
                errors.fullName ? 'border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
              }`}
              {...register('fullName', NAME_VALIDATION)}
            />
            {errors.fullName && (
              <span id="fullName-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
            <input
              type="text"
              disabled={!isEditing}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              className={`block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-50 ${
                errors.username ? 'border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
              }`}
              {...register('username', REQUIRED_VALIDATION('Username'))}
            />
            {errors.username && (
              <span id="username-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                {errors.username.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-50 ${
                errors.email ? 'border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
              }`}
              {...register('email', EMAIL_VALIDATION)}
            />
            {errors.email && (
              <span id="email-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              disabled={!isEditing}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`block h-12 w-full px-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-50 ${
                errors.phone ? 'border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
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

        {/* Address */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delivery Address</label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <MapPin className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              disabled={!isEditing}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'address-error' : undefined}
              className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 focus:outline-none transition-all disabled:opacity-50 ${
                errors.address ? 'border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
              }`}
              {...register('address', REQUIRED_VALIDATION('Address'))}
            />
          </div>
          {errors.address && (
            <span id="address-error" className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
              {errors.address.message}
            </span>
          )}
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
                disabled={isSubmitting}
                className="h-10 px-6 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
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
