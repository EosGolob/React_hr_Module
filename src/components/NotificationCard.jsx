
import React from 'react';

const NotificationCard = ({ message ,read }) => {
    const notificationStyle = {
        padding: '10px',
        borderBottom: '1px solid #ccc',
        backgroundColor: read ? '#f0f0f0' : '#fff',
        color: read ? '#666' : '#000'
    };
    return (
        <div className="notification-card" style={notificationStyle}>
            <p style={{marginLeft:'20px',color:'black'}}>{message}</p>
        </div>
    );
};

export default NotificationCard;
