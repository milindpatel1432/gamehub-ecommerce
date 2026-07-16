import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api/v1';
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // CHECK AUTH (Persistent Login)
  // ==========================
  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/profile');
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
    } finally {
      setLoading(false);
    }
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
      const response = await axios.post('/auth/login', {
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
      await axios.post('/auth/register', userData);
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
      await axios.post('/auth/logout');
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

  // Until authentication is checked, do not render the application
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gaming-dark text-gaming-cyan font-bold text-lg">
        Loading...
      </div>
    );
  }

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