import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password strength logic
  const passwordStrength = useMemo(() => {
    const pass = formData.password;
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
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    setIsLoading(true);

    // Simulated short delay
    setTimeout(() => {
      const res = register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error alert */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 font-semibold tracking-wide animate-pulse">
          {error}
        </div>
      )}

      {/* Grid for Name & Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name field */}
        <div className="space-y-2 text-left">
          <label htmlFor="fullName" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Marcus Thorne"
              required
              className="block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 transition-all"
            />
          </div>
        </div>

        {/* Username field */}
        <div className="space-y-2 text-left">
          <label htmlFor="username" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Username
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="marcus"
              required
              className="block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid for Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email field */}
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
              value={formData.email}
              onChange={handleInputChange}
              placeholder="marcus@gamehub.com"
              required
              className="block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 transition-all"
            />
          </div>
        </div>

        {/* Phone field */}
        <div className="space-y-2 text-left">
          <label htmlFor="phone" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Phone Number
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Phone className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+15550001234"
              required
              className="block h-12 w-full pl-11 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid for Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Password input */}
        <div className="space-y-1.5">
          <PasswordInput
            label="Password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
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
          name="confirmPassword"
          id="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
      </div>

      {/* Terms and conditions agreements */}
      <div className="text-left pt-1">
        <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded border-gaming-border bg-gaming-black text-gaming-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer"
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
      </div>

      {/* Register Trigger CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-full bg-gaming-cyan hover:bg-gaming-accent text-gaming-black hover:text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? 'Creating Account...' : 'Register'}
        {!isLoading && <ArrowRight className="h-4 w-4" />}
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
