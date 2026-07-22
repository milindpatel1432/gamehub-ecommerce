import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';
import { successToast, errorToast } from '../../utils/toast';
import {
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
  PHONE_VALIDATION,
  NAME_VALIDATION,
  REQUIRED_VALIDATION,
  USERNAME_VALIDATION
} from '../../utils/validation';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  // Watch password field to compute strength and matching validators
  const watchedPassword = watch('password');

  // Focus the first invalid field on initial mount (focus fullName field)
  useEffect(() => {
    setFocus('fullName');
  }, [setFocus]);

  // Password strength logic
  const passwordStrength = useMemo(() => {
    const pass = watchedPassword;
    if (!pass) return { label: '', color: 'bg-transparent', width: 'w-0' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };

    // Check complexity
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (pass.length >= 8 && hasLetter && (hasDigit || hasSpecial)) {
      return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    }
    return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
  }, [watchedPassword]);

  const onSubmit = async (data) => {
    if (!data.agreeTerms) {
      errorToast('You must agree to the Terms of Service.');
      return;
    }

    const res = await authRegister({
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
    });

    if (res.success) {
      successToast('Registration successful! Please login.');
      navigate('/login');
    } else {
      errorToast(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Grid for Name & Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="fullName" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="text"
              id="fullName"
              placeholder="Marcus Thorne"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                }`}
              {...register('fullName', NAME_VALIDATION)}
            />
          </div>
          {errors.fullName && (
            <span id="fullName-error" className="text-[10px] text-red-500 font-semibold tracking-wide block pl-1 animate-pulse">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* Username field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="username" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Username
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="text"
              id="username"
              placeholder="marcus"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                }`}
              {...register('username', USERNAME_VALIDATION)}
            />
          </div>
          {errors.username && (
            <span id="username-error" className="text-[10px] text-red-500 font-semibold tracking-wide block pl-1 animate-pulse">
              {errors.username.message}
            </span>
          )}
        </div>
      </div>

      {/* Grid for Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="email"
              id="email"
              placeholder="marcus@gamehub.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                }`}
              {...register('email', EMAIL_VALIDATION)}
            />
          </div>
          {errors.email && (
            <span id="email-error" className="text-[10px] text-red-500 font-semibold tracking-wide block pl-1 animate-pulse">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Phone field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="phone" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Phone Number
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Phone className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="tel"
              id="phone"
              placeholder="1234567890"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
                }`}
              {...register('phone', PHONE_VALIDATION)}
            />
          </div>
          {errors.phone && (
            <span id="phone-error" className="text-[10px] text-red-500 font-semibold tracking-wide block pl-1 animate-pulse">
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>

      {/* Grid for Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Password input */}
        <div className="space-y-1.5">
          <PasswordInput
            label="Password"
            id="password"
            error={errors.password}
            registration={register('password', PASSWORD_VALIDATION)}
          />

          {/* Password strength indicator layout */}
          {passwordStrength.label && (
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-gaming-black/60 rounded overflow-hidden">
                <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
              </div>
              <p className="text-[10px] text-right font-bold uppercase tracking-wider text-slate-500">
                Strength: <span className="text-white">{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm password input */}
        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          error={errors.confirmPassword}
          placeholder="••••••••"
          registration={register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (val) => val === watchedPassword || 'Passwords must match exactly',
          })}
        />
      </div>

      {/* Terms and conditions agreements */}
      <div className="text-left pt-1 space-y-1">
        <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors">
          <input
            type="checkbox"
            className="h-4 w-4 mt-0.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer"
            {...register('agreeTerms', { required: 'You must agree to the Terms & Conditions' })}
          />
          <span className="leading-relaxed">
            I accept the{' '}
            <Link to="#" className="text-gaming-cyan font-bold hover:underline">
              Terms & Conditions
            </Link>{' '}
            and the{' '}
            <Link to="#" className="text-gaming-cyan font-bold hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.agreeTerms && (
          <span className="text-[10px] text-red-500 font-semibold block pl-1 animate-pulse">
            {errors.agreeTerms.message}
          </span>
        )}
      </div>

      {/* Register Trigger CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? 'Creating Account...' : 'Register'}
        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
      </button>

      <SocialLogin />

      <div className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-gaming-cyan hover:underline hover:text-gaming-accent transition-colors"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}
