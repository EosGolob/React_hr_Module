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

    useEffect(() => {
        fetchProfileInfo();
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
    return (
        <>
            <div className="header">
                <span class="pe-3">Friday, July 8, 2022 19:18:17</span>
                <a class="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></a>
            </div>
            <div className='container' >
                <div class="dashboard-wrap">
                    <div className="profile-page-container" style={{ backgroundColor: '#F1FAEE' }}>
                        <h2>Login Profile Information</h2>
                        <p><strong>Name:</strong> {profileInfo.name}</p>
                        <p><strong>Email:</strong> {profileInfo.email}</p>
                        <p><strong>City: </strong>{profileInfo.city}</p>
                        <p><strong>Role: </strong>{profileInfo.role}</p>
                        {/* {profileInfo.role === "ADMIN" && (
                <button><Link to={`/update-user/${profileInfo.id}`}>Update This Profile</Link></button>
            )} */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;