import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH PROFILE (Persistent Login)
  // ==========================
  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      setUser(null);
      return { success: false, error: 'User profile not found' };
    } catch (error) {
      setUser(null);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user profile',
      };
    }
  }, []);

  // Fetch profile on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    };
    initializeAuth();
  }, [fetchProfile]);

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
        setUser(response.data.user);
        return { success: true };
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
        fetchProfile,
        updateProfile,
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