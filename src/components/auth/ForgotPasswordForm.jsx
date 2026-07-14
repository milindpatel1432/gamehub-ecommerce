import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { successToast } from '../../utils/toast';
import { EMAIL_VALIDATION } from '../../utils/validation';

export default function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  // Focus email on mount
  useEffect(() => {
    if (!isSent) {
      setFocus('email');
    }
  }, [setFocus, isSent]);

  const onSubmit = async (data) => {
    // Simulated short delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmittedEmail(data.email);
    setIsSent(true);
    successToast('Reset link dispatched to your inbox!');
  };

  return (
    <div className="space-y-6">
      {isSent ? (
        /* Success reset notification banner */
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="p-4 rounded-xl border border-gaming-cyan/20 bg-gaming-cyan/5 text-xs text-gaming-cyan leading-relaxed">
            A password reset link has been successfully dispatched to <strong>{submittedEmail}</strong>. Check your inbox and spam folders.
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-gaming-cyan hover:text-gaming-accent hover:underline transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Login
          </Link>
        </div>
      ) : (
        /* Reset form template */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
                className={`block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
            {!isSubmitting && <Send className="h-3.5 w-3.5" />}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-gaming-cyan hover:underline transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
