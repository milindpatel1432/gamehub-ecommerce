import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';
import { successToast, errorToast } from '../../utils/toast';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../../utils/validation';

export default function LoginForm({ onSuccess, onSwitchTab }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Focus the first invalid field on initial mount (focus email field)
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data) => {
    setServerError('');
    const res = await login(data.email, data.password);
    if (res.success) {
      successToast('Welcome back! Logged in successfully.');
      if (onSuccess) {
        onSuccess();
      }
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      const errMsg = res.error || 'Invalid email or password';
      setServerError(errMsg);
      errorToast(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Server Error Alert Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn text-left">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Email input field */}
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
            placeholder="gaming@gamehub.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 transition-all ${
              errors.email ? 'border-red-500 focus:border-red-500' : 'border-gaming-border focus:border-gaming-cyan/60'
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

      {/* Password input field */}
      <PasswordInput
        label="Password"
        id="password"
        error={errors.password}
        registration={register('password', PASSWORD_VALIDATION)}
      />

      {/* Remember Me & Forgot Password links */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer"
            {...register('rememberMe')}
          />
          <span>Remember Me</span>
        </label>
        <Link
          to="/forgot-password"
          className="font-bold text-gaming-cyan hover:underline hover:text-gaming-accent transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Action Trigger CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? 'Verifying Account...' : 'Sign In'}
        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
      </button>

      {/* Social login buttons wrapper */}
      <SocialLogin />

      {/* Registration helper footer */}
      <div className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => {
            if (onSwitchTab) {
              onSwitchTab('register');
            } else {
              navigate('/register');
            }
          }}
          className="font-bold text-gaming-cyan hover:underline hover:text-gaming-accent transition-colors cursor-pointer"
        >
          Register Here
        </button>
      </div>
    </form>
  );
}
