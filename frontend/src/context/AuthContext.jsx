import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const { data } = await client.get('/api/auth/me');
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (formData) => {
    const { data } = await client.post('/api/auth/register', formData);
    setUser(data.user);
    return data;
  };
  
  const login = async (formData) => {
    const { data } = await client.post('/api/auth/login', formData);
    setUser(data.user);
    return data;
  };
  
  const logout = async () => {
    await client.post('/api/auth/logout');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
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

export default AuthContext;
