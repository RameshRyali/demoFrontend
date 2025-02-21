import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error("Invalid response format:", data);
        return;
      }

      // Format notifications from booking status
      const formattedNotifications = data.map((booking) => ({
        message: `Your booking with ${booking.photographerId.name} is now ${booking.status}.`,
        status: booking.status.toLowerCase(), // Normalize status for filtering
        timestamp: booking.date, // Using booking date as timestamp
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Filtered notifications based on the selected status
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.status === filter);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Booking Status Updates</h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          className="border p-2 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <p>No new booking status updates.</p>
      ) : (
        <ul>
          {filteredNotifications.map((notification, index) => (
            <li
              key={index}
              className="p-2 border-b hover:bg-gray-100 transition duration-200"
            >
              {notification.message}
              <span className="text-xs text-gray-500 ml-2">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
