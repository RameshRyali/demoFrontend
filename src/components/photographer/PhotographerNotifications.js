import React, { useEffect, useState } from 'react';
import { getPhotographerNotifications } from '../../services/api';

const NotificationIcon = ({ type }) => {
  const iconStyles = {
    info: "text-blue-500 bg-blue-100",
    success: "text-green-500 bg-green-100",
    warning: "text-yellow-500 bg-yellow-100",
    error: "text-red-500 bg-red-100"
  };

  const icons = {
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    error: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  };

  return (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconStyles[type] || iconStyles.info}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type] || icons.info} />
      </svg>
    </div>
  );
};

const PhotographerNotifications = ({ token, photographerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!photographerId) {
      setError("Photographer ID is missing");
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const data = await getPhotographerNotifications(token, photographerId);
        setNotifications(data || []);
      } catch (error) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [photographerId, token]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "years", seconds: 31536000 },
      { label: "months", seconds: 2592000 },
      { label: "days", seconds: 86400 },
      { label: "hours", seconds: 3600 },
      { label: "minutes", seconds: 60 }
    ];

    for (const { label, seconds: s } of intervals) {
      const interval = seconds / s;
      if (interval > 1) return `${Math.floor(interval)} ${label} ago`;
    }
    return "Just now";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center space-x-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h2 className="text-2xl font-semibold">Notifications</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No New Notifications</div>
          ) : (
            notifications.map(({ _id, type, message, date, isNew }) => (
              <div key={_id} className="p-5 flex items-start space-x-4 hover:bg-gray-50 transition duration-200">
                <NotificationIcon type={type} />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{message}</p>
                  <p className="text-gray-500 text-sm">{formatTimeAgo(date)}</p>
                </div>
                {isNew && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">New</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotographerNotifications;
