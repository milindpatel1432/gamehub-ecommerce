import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated short delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {isSent ? (
        /* Success reset notification banner */
        <div className="space-y-6 text-center py-4">
          <div className="p-4 rounded-xl border border-gaming-cyan/20 bg-gaming-cyan/5 text-xs text-gaming-cyan leading-relaxed">
            A password reset link has been successfully dispatched to <strong>{email}</strong>. Check your inbox and spam folders.
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-4.5 w-4.5 text-slate-500" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gaming@gamehub.com"
                required
                className="block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            {!isLoading && <Send className="h-3.5 w-3.5" />}
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
