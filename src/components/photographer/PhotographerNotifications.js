// src/pages/PhotographerNotifications.js
import React, { useState, useEffect } from 'react';
import { getPhotographerNotifications } from '../../services/api';

const PhotographerNotifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getPhotographerNotifications(token);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification._id} className="border p-4 rounded shadow">
            <p><strong>Message:</strong> {notification.message}</p>
            <p><strong>Date:</strong> {new Date(notification.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotographerNotifications;
