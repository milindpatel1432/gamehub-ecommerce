import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    // Seed a default credentials account for easy testing
    {
      fullName: 'Marcus Thorne',
      username: 'marcus',
      email: 'marcus@gamehub.com',
      phone: '+15550001234',
      password: 'Password123',
    },
  ]);

  const login = (email, password) => {
    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (matched) {
      setUser({
        fullName: matched.fullName,
        username: matched.username,
        email: matched.email,
        phone: matched.phone,
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData) => {
    const { fullName, username, email, phone, password } = userData;
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'Email or Username is already registered.' };
    }
    const newUser = { fullName, username, email, phone, password };
    setRegisteredUsers((prev) => [...prev, newUser]);
    // Log them in immediately
    setUser({ fullName, username, email, phone });
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
