import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Invalid response format:", data);
        return;
      }

      const formattedNotifications = data.map((booking) => {
        const photographerName = booking.photographerId?.name || "Unknown Photographer";
        return {
          message: `Your booking with ${photographerName} is now ${booking.status}.`,
          status: booking.status.toLowerCase(),
          timestamp: booking.date,
        };
      });

      setNotifications(formattedNotifications);
      console.log("Fetched Notifications:", formattedNotifications); // Debugging line
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      completed: "from-green-500 to-green-400",
      confirmed: "from-blue-500 to-blue-400",
      pending: "from-yellow-500 to-yellow-400",
      cancelled: "from-red-500 to-red-400",
    };
    return colors[status] || "from-gray-500 to-gray-400";
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: "✅",
      confirmed: "👍",
      pending: "⏳",
      cancelled: "❌",
    };
    return icons[status] || "📝";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-xl font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 mb-4">
            Booking Updates
          </h2>
          <p className="text-gray-300 text-lg">Stay updated with your photography session status</p>
        </motion.div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-lg font-medium transition-colors duration-200 ${
                  filter === status
                    ? "bg-white/30 text-white border-white/30"
                    : "bg-white/20 text-gray-300 border-white/20 hover:bg-white/30 hover:text-white"
                }`}
              >
                {status === "all" ? "🔍 All Updates" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Updates Yet</h3>
                <p className="text-gray-300">Check back later for new booking updates</p>
              </motion.div>
            ) : (
              <motion.ul
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredNotifications.map((notification, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(notification.status)} opacity-5 rounded-xl blur-sm group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r ${getStatusColor(notification.status)} text-white text-xl`}>
                        {getStatusIcon(notification.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white text-lg font-medium mb-1">{notification.message}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(notification.timestamp).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
