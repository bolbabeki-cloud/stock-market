import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, signupUser, updateUser } from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true' && Boolean(localStorage.getItem('currentUser'));
  });

  const login = useCallback(async (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (
      normalizedEmail === 'demo@stockportfolio.com' &&
      normalizedPassword === 'demo123'
    ) {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@stockportfolio.com',
        name: 'Demo User',
        country: 'India',
        phone: '',
        preferredCurrency: 'INR — Indian Rupee',
        bio: '',
      };

      setCurrentUser(demoUser);
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    try {
      const { user } = await loginUser(email, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('portfolio_') || key.startsWith('watchlist_') || key.startsWith('demoPaymentHistory_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const signup = useCallback(async (email, password, name, country) => {
    try {
      const { user } = await signupUser(email, password, name, country);
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!currentUser) return { success: false, error: 'No active user' };

    try {
      const { user } = await updateUser(currentUser.id, updates);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        logout,
        signup,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
