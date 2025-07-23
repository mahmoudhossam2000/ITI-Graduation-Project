import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual Firebase auth
      const userData = {
        id: '1',
        email,
        name: 'مستخدم تجريبي',
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setCurrentUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'فشل تسجيل الدخول' };
    }
  };

  const signup = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      setCurrentUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'فشل إنشاء الحساب' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Simulate Google sign in
      const userData = {
        id: Date.now().toString(),
        email: 'user@gmail.com',
        name: 'مستخدم جوجل',
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setCurrentUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'فشل تسجيل الدخول بجوجل' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};