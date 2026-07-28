import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { LOCAL_STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      const cachedUserStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
      if (token && cachedUserStr) {
        return JSON.parse(cachedUserStr);
      }
    } catch (_e) {}
    return null;
  });
  const [loading, setLoading] = useState(() => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      const cachedUserStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
      if (token && cachedUserStr) {
        return false;
      }
    } catch (_e) {}
    return true;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [authRedirectUrl, setAuthRedirectUrl] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const openAuthModal = (tab = 'login', redirectUrl = null) => {
    setAuthModalTab(tab);
    if (redirectUrl) {
      setAuthRedirectUrl(redirectUrl);
    } else if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      if (!['/login', '/register', '/forgot-password'].includes(window.location.pathname)) {
        setAuthRedirectUrl(currentPath);
      }
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const clearAuthRedirectUrl = () => {
    setAuthRedirectUrl(null);
  };

  const clearPendingAction = () => {
    setPendingAction(null);
  };

  const setIntentAndOpenAuth = (intent) => {
    // intent: { action: 'ADD_TO_CART' | 'ADD_TO_WISHLIST' | 'BUY_NOW' | 'CHECKOUT', payload: {...}, redirectTo: '...' }
    setPendingAction(intent);
    const targetUrl = intent?.redirectTo || (typeof window !== 'undefined' ? window.location.pathname + window.location.search + window.location.hash : null);
    openAuthModal('login', targetUrl);
  };

  // ==========================
  // CHECK AUTH (Persistent Login)
  // ==========================
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.warn('[AuthContext] Profile fetch warning:', error?.message || error);
    }

    // Fallback: check cached user in localStorage if auth token is present
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    const cachedUserStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    if (token && cachedUserStr) {
      try {
        const cachedUser = JSON.parse(cachedUserStr);
        if (cachedUser) {
          setUser(cachedUser);
          setLoading(false);
          return { success: true, user: cachedUser };
        }
      } catch (_e) {}
    }

    setUser(null);
    setLoading(false);
    return { success: false, error: 'User profile not found' };
  };

  // Run checkAuth once when application starts
  useEffect(() => {
    checkAuth();
  }, []);

  // ==========================
  // LOGIN
  // ==========================
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data?.success && response.data?.user) {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
        }
        setUser(response.data.user);
        closeAuthModal();
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid email or password.',
      };
    }
  };

  // ==========================
  // REGISTER
  // ==========================
  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return {
        success: true,
        message: 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          'Registration failed.',
      };
    }
  };

  // ==========================
  // LOGOUT
  // ==========================
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
    }
  };

  // ==========================
  // UPDATE PROFILE
  // ==========================
  const updateProfile = (updatedData) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updatedData,
      };
    });

    return {
      success: true,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        checkAuth,
        updateProfile,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        authRedirectUrl,
        setAuthRedirectUrl,
        clearAuthRedirectUrl,
        pendingAction,
        setPendingAction,
        clearPendingAction,
        setIntentAndOpenAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}