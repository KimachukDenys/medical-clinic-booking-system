import React, { createContext, useState, useContext } from 'react';

interface AuthData {
  id?: number;
  role: 'admin' | 'doctor' | 'patient' | null;
  firstName?: string;
  lastName?: string;
  isAuthenticated: boolean;
  logout: () => void;
  login: (data: Partial<AuthData>) => void;
}

const AuthContext = createContext<AuthData>({
  id: undefined,
  role: null,
  firstName: '',
  lastName: '',
  isAuthenticated: false,
  logout: () => {},
  login: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<Omit<AuthData, 'logout' | 'login'>>({
    id: undefined,
    role: null,
    firstName: '',
    lastName: '',
    isAuthenticated: false,
  });

  const login = (data: Partial<AuthData>) => {
    setAuthData((prev) => ({
      ...prev,
      ...data,
      isAuthenticated: true,
    }));
  };

  const logout = () => {
    setAuthData({
      id: undefined,
      role: null,
      firstName: '',
      lastName: '',
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authData, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
