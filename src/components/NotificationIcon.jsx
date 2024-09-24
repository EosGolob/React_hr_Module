import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationCard from './NotificationCard';

const NotificationIcon = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await axios.get('http://localhost:8080/api/count/unread', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(response.data || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Function to mark notifications as read and fetch notifications
    const handleMarkAsReadAndFetchNotifications = async () => {
        // setLoading(true);
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await axios.post('http://localhost:8080/api/marksAsReadAndShowNotification', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
            // setLoading(false);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }finally {
            // setLoading(false); 
        }
    };

    // Fetch unread count every 3 seconds
    useEffect(() => {
        fetchUnreadCount(); // Initial fetch
        const intervalId = setInterval(fetchUnreadCount, 3000); // 3 seconds interval
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    // Toggle notification popup visibility
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            handleMarkAsReadAndFetchNotifications();
        }
    };

    return (
        <div className="notification-icons">
           <button className = "xyz"style={{cursor: 'pointer', backgroundColor:'#ffffff'}} onClick={toggleNotifications}>
                <span className="icons">🔔</span>
                {unreadCount > 0 && <span className="count" style={{ color: 'black' }}>{unreadCount}</span>}
            </button>
           {showNotifications && (
                <div className="notification-popup" style={popupStyle}>
                    {notifications.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationCard 
                            key={notification.id} 
                            message={notification.notificationMessage}    
                            read={notification.read} 
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Inline style for popup positioning
const popupStyle = {
    position: 'absolute',
    top: '100%', // Adjust based on your needs
    right: '0',
    width: '250px', // Adjust width as needed
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: '1000',
    maxHeight: '300px',
    overflowY: 'auto'
};

export default NotificationIcon;
