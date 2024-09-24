import React, { useState, useContext } from 'react';
import UsersService from '../services/UsersService';
import { useNavigate, Link } from 'react-router-dom';
import './RegistrationPage.css'
import { AuthContext } from '../auth/AuthContext';
import NotificationIcon from '../NotificationIcon'
function RegistrationPage() {
    const { logout } = useContext(AuthContext);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        city: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleRoleChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            role: value,
            process: value === 'ADMIN' ? 'ADMIN' : prevState.process
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const token = localStorage.getItem('token');
    //         await UsersService.register(formData, token);

    //         // Clear the form fields after successful registration
    //         setFormData({
    //             name: '',
    //             email: '',
    //             password: '',
    //             role: '',
    //             city: '',
    //             process: ''
    //         });
    //         alert('User registered successfully');
    //         // navigate('/admin/user-management');

    //     } catch (error) {
    //         console.error('Error registering user:', error);
    //         alert('An error occurred while registering user');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await UsersService.register(formData, token);

            if (response.statusCode === 200) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: '',
                    city: '',
                    process: ''
                });
                alert('User registered successfully');
            } else {
                alert(response.error);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering user');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            logout();
            navigate('/');
        }
    };

    return (
        <>
            <div className="header">

                <span className="pe-3">{currentDateTime}</span>
                <NotificationIcon />
                <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
            </div>
            <div className="dashboard-wrap">
                <div className="profile-page-container">
                    <h2>Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Emp ID:</label>
                            <input type="text" name="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Role:</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleRoleChange}
                                required
                            >
                                <option value="">Select role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Process:</label>
                            <input
                                type="text"
                                name="process"
                                value={formData.process}
                                onChange={handleInputChange}
                                placeholder={formData.role === 'ADMIN' ? 'ADMIN' : 'Enter process'}
                                required
                                disabled={formData.role === 'ADMIN'}
                            />
                        </div>
                        <div className="form-group">
                            <label>City:</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter your city" required />
                        </div>
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegistrationPage;