import React, { createContext, useContext, useState, useEffect } from 'react';
import UsersService from '../services/UsersService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                const response = await UsersService.getYourProfile(token);
                setUser(response.ourUsers);
            } catch (error) {
                console.error('Error fetching profile information:', error);
            }
        };

        fetchProfileInfo();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};