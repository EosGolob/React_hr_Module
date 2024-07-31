import React, { useState, useEffect, useContext } from 'react';
import UsersService from '../services/UsersService';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/bootstrap.min.css';
import '../css/layout.css';
import '../css/style.css';
import '../css/login.css';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        fetchProfileInfo();
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000); // Update every second
        return () => clearInterval(intervalId);
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UsersService.getYourProfile(token);
            setProfileInfo(response.ourUsers);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };


    const handleLogout = (e) => {
        e.preventDefault(); // Prevent the default anchor behavior
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            logout();
            navigate('/');
        }
    };

    const updateDateTime = () => {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
        setCurrentDateTime(formattedDateTime);
    };
    return (
        <>
            <div className="header">
            <span className="pe-3">{currentDateTime}</span>
                <a class="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></a>
            </div>
            <div class="dashboard-wrap">
                <div className="profile-page-container" >
                    <h2>Login Profile Information</h2>
                    <p><strong>Name:</strong> {profileInfo.name}</p>
                    <p><strong>Emp ID:</strong> {profileInfo.email}</p>
                    <p><strong>City: </strong>{profileInfo.city}</p>
                    <p><strong>Role: </strong>{profileInfo.role}</p>
                </div>
            </div>

        </>
    );
}

export default ProfilePage;