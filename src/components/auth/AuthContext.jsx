import React, { createContext, useState, useEffect } from 'react';
import UsersService from '../services/UsersService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UsersService.isAuthenticated());
    const [role, setRole] = useState(UsersService.getRole());
    const [name, setName] = useState(UsersService.getName());
    const [process, setProcess] = useState(UsersService.getProcess() || '');

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(UsersService.isAuthenticated());
            setRole(UsersService.getRole());
            setName(UsersService.getName());
            setProcess(UsersService.getProcess() || '');

        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token, role, name, process) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        localStorage.setItem('process', process);

        setIsAuthenticated(true);
        setRole(role);
        setName(name);
        setProcess(process);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('process');

        UsersService.logout();
        setIsAuthenticated(false);
        setRole(null);
        setName(null);
        setProcess(null);

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, name, process, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
