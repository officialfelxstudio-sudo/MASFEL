import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isOwner: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    return localStorage.getItem('isOwner') === 'true';
  });

  const login = (password: string) => {
    if (password === 'F33lx.id$$') {
      setIsOwner(true);
      localStorage.setItem('isOwner', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsOwner(false);
    localStorage.removeItem('isOwner');
  };

  return (
    <AuthContext.Provider value={{ isOwner, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
