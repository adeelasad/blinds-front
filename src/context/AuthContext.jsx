import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('lumina_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('lumina_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('lumina_token');
    localStorage.removeItem('lumina_customer');
  }, []);

  useEffect(() => {
    if (token) {
      api.getCustomerProfile(token)
        .then(res => {
          if (res.success && res.customer) {
            setCustomer(res.customer);
            localStorage.setItem('lumina_customer', JSON.stringify(res.customer));
          } else if (res.error && res.error.includes('expired')) {
            logout();
          }
        })
        .catch(() => {});
    }
  }, [token, logout]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setCustomer(res.customer);
        localStorage.setItem('lumina_token', res.token);
        localStorage.setItem('lumina_customer', JSON.stringify(res.customer));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res.success && res.token) {
        setToken(res.token);
        setCustomer(res.customer);
        localStorage.setItem('lumina_token', res.token);
        localStorage.setItem('lumina_customer', JSON.stringify(res.customer));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    const res = await api.updateCustomerProfile(token, data);
    if (res.success && res.customer) {
      setCustomer(res.customer);
      localStorage.setItem('lumina_customer', JSON.stringify(res.customer));
    }
    return res;
  };

  const changePassword = async (current_password, new_password) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    return await api.updateCustomerPassword(token, current_password, new_password);
  };

  return (
    <AuthContext.Provider value={{
      customer,
      token,
      isAuthenticated: !!token && !!customer,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
