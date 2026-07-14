import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated short delay
    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error alert wrapper */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 font-semibold tracking-wide animate-pulse">
          {error}
        </div>
      )}

      {/* Email input field */}
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
            className="block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 focus:ring-0 transition-all"
          />
        </div>
      </div>

      {/* Password input field */}
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Remember Me & Forgot Password links */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer"
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
        disabled={isLoading}
        className="w-full h-12 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? 'Verifying Account...' : 'Sign In'}
        {!isLoading && <ArrowRight className="h-4 w-4" />}
      </button>

      {/* Social login buttons wrapper */}
      <SocialLogin />

      {/* Registration helper footer */}
      <div className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-bold text-gaming-cyan hover:underline hover:text-gaming-accent transition-colors"
        >
          Register Here
        </Link>
      </div>
    </form>
  );
}
