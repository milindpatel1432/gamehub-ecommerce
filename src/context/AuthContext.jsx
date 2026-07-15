import { createContext, useContext, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api/v1';
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ==========================
  // LOGIN
  // ==========================
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const loggedUser = response.data.user;

      setUser({
        fullName: loggedUser.fullName,
        username: loggedUser.username,
        email: loggedUser.email,
        phone: loggedUser.phone,
        address: loggedUser.address || '',
        role: loggedUser.role,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Invalid email or password.',
      };
    }
  };

  // ==========================
  // LOGOUT
  // ==========================
  const logout = () => {
    setUser(null);
  };

  // ==========================
  // REGISTER
  // (Frontend temporary version)
  // ==========================
  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);

      const newUser = response.data.user;

      setUser({
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        address: '',
        role: newUser.role,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Registration failed.',
      };
    }
  };

  // ==========================
  // UPDATE PROFILE
  // ==========================
  const updateProfile = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
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