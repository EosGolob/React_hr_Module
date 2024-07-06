import React, { createContext, useState, useEffect } from 'react';
import UsersService from '../services/UsersService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(UsersService.isAuthenticated());
  const [role, setRole] = useState(UsersService.getRole());

  useEffect(() => {
    setIsAuthenticated(UsersService.isAuthenticated());
    setRole(UsersService.getRole());
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    UsersService.logout();
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};