import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Optimistically load cached user from localStorage to render UI instantly
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('zorvyn_user');
    try {
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });

  // If we have a cached user, we don't show the initial loading block
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('zorvyn_token');
    const cachedUser = localStorage.getItem('zorvyn_user');
    return !!(token && !cachedUser);
  });

  const [error, setError] = useState(null);

  // Silent session validation on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('zorvyn_token');
      if (!token) {
        setUser(null);
        localStorage.removeItem('zorvyn_user');
        setLoading(false);
        return;
      }

      try {
        const userData = await api.get('/api/auth/me');
        setUser(userData);
        localStorage.setItem('zorvyn_user', JSON.stringify(userData));
      } catch (err) {
        console.error('Session validation failed:', err.message);
        // Clear expired/invalid session and redirect
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', { email, password });
      
      const userProfile = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem('zorvyn_token', data.token);
      localStorage.setItem('zorvyn_user', JSON.stringify(userProfile));
      setUser(userProfile);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'Viewer') => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.post('/api/auth/register', { name, email, password, role });
      
      const userProfile = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem('zorvyn_token', data.token);
      localStorage.setItem('zorvyn_user', JSON.stringify(userProfile));
      setUser(userProfile);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('zorvyn_token');
    localStorage.removeItem('zorvyn_user');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        login,
        register,
        logout,
      }}
    >
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
