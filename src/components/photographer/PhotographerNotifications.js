import React, { useEffect, useState } from 'react';
import { getPhotographerNotifications } from '../../services/api';  // Assuming getPhotographerNotifications is in 'api.js'
 

const PhotographerNotifications = ({ token, photographerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!photographerId) {
      console.error("Photographer ID is missing");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const data = await getPhotographerNotifications(token, photographerId);
        
        if (data.length) {
          setNotifications(data);
        } else {
          console.error('No notifications found.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [photographerId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <p>{notification.message}</p>
              <p>{new Date(notification.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PhotographerNotifications;
