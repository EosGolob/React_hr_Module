
import React, { createContext, useContext, useState, useEffect } from 'react';
import UsersService from '../services/UsersService';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);  
  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            console.error('No token found in localStorage.');
            return;
          }
      
          const profileData = await UsersService.getYourProfile(token);
          // console.log('Profile Response:', profileData);
  
          if (profileData && profileData.ourUsers) {
            setUser(profileData.ourUsers);
            setRole(profileData.ourUsers.role);
            
          } else {
            console.error('Profile data or ourUsers is missing.');
          }
        } catch (error) {
          console.error('Error fetching profile information:', error);
        }
      };
  

    fetchProfileInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};