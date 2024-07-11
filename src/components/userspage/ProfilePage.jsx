import React, { useState, useEffect } from 'react';
// import UserService from '../service/UserService';
import UsersService from '../services/UsersService';
import { Link } from 'react-router-dom';



function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

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

    return (
        <div className='container' style={{backgroundColor: '#A8DADC', minHeight: '100vh', padding: '20px', minWidth:'100%'}}>
        <div className="profile-page-container" style={{backgroundColor: '#F1FAEE' }}>
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
    );
}

export default ProfilePage;