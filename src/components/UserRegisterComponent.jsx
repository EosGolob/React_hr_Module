import React, { useState } from 'react';
import { createUser } from "../services/UsersService";

const UserRegisterComponent = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        // enabled: true,
        profile: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data:', formData);

        // const currentDate = new Date().toISOString(); // Get current date and time in ISO format
        // const dataToSubmit = { ...formData, createdDate: currentDate };
        
      
        try {
            const response = await createUser(formData);
            console.log('User created successfully:', response.data);
            // Handle success, e.g., show a success message or redirect
        } catch (error) {
            console.error('Error creating user:', error);
            // Handle error, e.g., show an error message
        }
    };

    return (
        <div className='container'>
            <br></br>
            <div className="card col-md-6 offset-md-3 offset-md-3">
            <div className='card-body'>
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label className='form-label'>First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='form-group'>
                <label className='form-label'>Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='form-group'>
                <label className='form-label'>Username:</label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='form-group'>
                <label className='form-label'>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='form-group'>
                <label className='form-label'>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
           
            {/* <div className='form-group'>
                <label className='form-label'>Enabled:</label>
                <input
                    type="checkbox"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleChange}
                />
            </div> */}
            <div className='form-group'>
                <label className='form-label'>Profile:</label>
                <input
                    type="text"
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Register</button>
        </form>
        </div>
        </div>
        </div>
    );
};

export default UserRegisterComponent;
