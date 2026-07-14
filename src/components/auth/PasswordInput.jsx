import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = '••••••••',
  name = 'password',
  id = 'password',
  required = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Lock className="h-4.5 w-4.5 text-slate-500" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="block h-12 w-full pl-11 pr-12 rounded-xl bg-gaming-black/60 border border-gaming-border text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan/60 focus:ring-0 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>
      </div>
    </div>
  );
}
