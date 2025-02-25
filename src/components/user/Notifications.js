import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

      const formattedNotifications = data.map((booking) => ({
        message: `Your booking with ${booking.photographerId.name} is now ${booking.status}.`,
        status: booking.status.toLowerCase(),
        timestamp: booking.date,
      }));

      setNotifications(formattedNotifications);
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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 bg-white/15 p-4 rounded-xl backdrop-blur-md">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-blue-300">🔍</span> Filter by Status
            </h3>
            <div className="relative">
              <select
                className="pl-4 pr-10 py-3 rounded-xl bg-white/20 text-white border-2 border-white/30 
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none
                         cursor-pointer hover:bg-white/30 transition-all duration-200
                         text-lg font-medium shadow-lg backdrop-blur-lg
                         appearance-none w-48 [&>option]:bg-gray-800 [&>option]:text-lg"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  background: `${filter === 'all' ? 'rgba(255, 255, 255, 0.2)' : 
                    filter === 'pending' ? 'rgba(234, 179, 8, 0.3)' :
                    filter === 'confirmed' ? 'rgba(59, 130, 246, 0.3)' :
                    filter === 'completed' ? 'rgba(34, 197, 94, 0.3)' :
                    filter === 'cancelled' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`
                }}
              >
                <option value="all" style={{ backgroundColor: '#1f2937', color: 'white', padding: '10px' }}>
                  🔍 All Updates
                </option>
                <option value="pending" style={{ backgroundColor: '#1f2937', color: '#fbbf24', padding: '10px' }}>
                  ⏳ Pending
                </option>
                <option value="confirmed" style={{ backgroundColor: '#1f2937', color: '#60a5fa', padding: '10px' }}>
                  👍 Confirmed
                </option>
                <option value="completed" style={{ backgroundColor: '#1f2937', color: '#4ade80', padding: '10px' }}>
                  ✅ Completed
                </option>
                <option value="cancelled" style={{ backgroundColor: '#1f2937', color: '#f87171', padding: '10px' }}>
                  ❌ Cancelled
                </option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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
                          {new Date(notification.timestamp).toLocaleString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
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
