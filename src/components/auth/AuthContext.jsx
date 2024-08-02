import React, { createContext, useState, useEffect } from 'react';
import UsersService from '../services/UsersService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(UsersService.isAuthenticated());
  const [role, setRole] = useState(UsersService.getRole());
  const [name , setName] = useState(UsersService.getName());

  // useEffect(() => {
  //   setIsAuthenticated(UsersService.isAuthenticated());
  //   setRole(UsersService.getRole());
  // }, [isAuthenticated, role]);
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(UsersService.isAuthenticated());
      setRole(UsersService.getRole());
      setName(UsersService.getUserName());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token, role,name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    setIsAuthenticated(true);
    setRole(role);
    setName(name);
    console.log("auth login function page name" ,name);
    console.log("auth login function page role ",role);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name'); 
    UsersService.logout();
    setIsAuthenticated(false);
    setRole(null);
    setName(null)
  };
 
  return (
    <AuthContext.Provider value={{ isAuthenticated, role,name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};