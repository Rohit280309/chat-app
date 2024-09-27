import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
 
  useEffect(() => {
    const checkToken = async () => {
      const credentials = await SecureStore.getItemAsync("token");
      if (credentials) {
        setIsLoggedIn(true);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
