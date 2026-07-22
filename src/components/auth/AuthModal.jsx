import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import logo from '../../assets/images/logo.webp';

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, setAuthModalTab } = useAuth();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={closeAuthModal}
          />

          {/* Modal Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl border border-slate-800/90 bg-[#0b0f1d]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.8)] z-10 my-auto text-left"
          >
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-800/80">
              <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                <img
                  src={logo}
                  alt="GameHub Logo"
                  className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                />
              </div>
              <div>
                <h3 className="font-sans text-lg font-extrabold text-white tracking-tight">
                  {authModalTab === 'login' ? 'Welcome Back' : 'Join GameHub'}
                </h3>
                <p className="text-xs text-slate-400">
                  {authModalTab === 'login'
                    ? 'Enter your credentials to access your account'
                    : 'Create your account to start buying and renting games'}
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6">
              <button
                onClick={() => setAuthModalTab('login')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  authModalTab === 'login'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => setAuthModalTab('register')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  authModalTab === 'register'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Form Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {authModalTab === 'login' ? (
                <LoginForm
                  onSuccess={closeAuthModal}
                  onSwitchTab={() => setAuthModalTab('register')}
                />
              ) : (
                <RegisterForm
                  onSuccess={() => setAuthModalTab('login')}
                  onSwitchTab={() => setAuthModalTab('login')}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
