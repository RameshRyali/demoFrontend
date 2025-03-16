import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiCalendar, FiCamera, FiCheck, FiClock, FiPackage, FiPhone, FiStar, FiUser, FiX } from 'react-icons/fi';
import { getPhotographerBookings, updateBookingStatus } from '../../services/api';

const PhotographerBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getPhotographerBookings(token);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [token]);

  const handleStatusChange = async (bookingId, selectedStatus) => {
    const validStatuses = ["Pending", "Confirmed", "Completed", "Canceled"];
    if (!validStatuses.includes(selectedStatus)) return;

    try {
      await updateBookingStatus(bookingId, selectedStatus);
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: selectedStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 border-amber-400/30',
      confirmed: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 border-emerald-400/30',
      completed: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 border-blue-400/30',
      canceled: 'bg-gradient-to-br from-rose-400 via-rose-500 to-pink-500 border-rose-400/30'
    };
    return styles[status.toLowerCase()] || 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 border-gray-400/30';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-900 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-50"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center transform rotate-3 shadow-xl">
                <FiCamera className="w-14 h-14 text-white transform -rotate-3" />
              </div>
            </div>
          </div>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 tracking-tight">
            Photography Sessions
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Manage your upcoming photography bookings and client sessions effortlessly
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-lg mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-lg">
                  <FiCalendar className="w-14 h-14 text-white transform -rotate-3" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No Active Bookings</h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Your photography session bookings will appear here. Check back later for new client requests.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative">
                        <div className="flex items-start space-x-6 mb-8">
                          <div className="flex-shrink-0">
                            {booking.userId?.profilePhoto ? (
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                                <img
                                  src={booking.userId.profilePhoto}
                                  alt="Client"
                                  className="relative w-24 h-24 rounded-2xl object-cover"
                                />
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                  <FiUser className="w-12 h-12 text-white/90" />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300 mb-3">
                              {booking.userId?.name || "Unknown Client"}
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center text-white/80">
                                <FiPackage className="w-5 h-5 mr-3 text-purple-400" />
                                <span className="text-lg">{booking.event || "N/A"}</span>
                              </div>
                              <div className="flex items-center text-white/80">
                                <FiCalendar className="w-5 h-5 mr-3 text-purple-400" />
                                <span className="text-lg">{new Date(booking.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-white/80">
                                <FiClock className="w-5 h-5 mr-3 text-purple-400" />
                                <span className="text-lg">{booking.timeSlot}</span>
                              </div>

                              <div className="flex items-center text-white/80">
                                <FiUser className="w-5 h-5 mr-3 text-purple-400" />
                                <span className="text-lg">{booking.location || "Location not specified"}</span>
                              </div>
                              <div className="flex items-center text-white/80">
                                <FiClock className="w-5 h-5 mr-3 text-purple-400" />
                                <span className="text-lg">{booking.eventDuration || "Duration not specified"}</span>
                              </div>
                              {booking.status === "Confirmed" && booking.userId?.phone && (
                                <div className="flex items-center text-white/80">
                                  <FiPhone className="w-5 h-5 mr-3 text-purple-400" />
                                  <span className="text-lg">{booking.userId.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-8">
                          <div className={`px-6 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg inline-flex items-center space-x-2 ${getStatusStyle(booking.status)}`}>
                            <FiStar className="w-4 h-4" />
                            <span>{booking.status}</span>
                          </div>
                        </div>

                        {booking.status.toLowerCase() === "pending" && (
                          <div className="flex space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStatusChange(booking._id, "Confirmed")}
                              className="flex-1 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <FiCheck className="w-5 h-5" />
                              <span>Accept</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStatusChange(booking._id, "Canceled")}
                              className="flex-1 bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600 hover:from-rose-500 hover:via-rose-600 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <FiX className="w-5 h-5" />
                              <span>Decline</span>
                            </motion.button>
                          </div>
                        )}

                        {booking.status.toLowerCase() === "confirmed" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusChange(booking._id, "Completed")}
                            className="w-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FiCheck className="w-5 h-5" />
                            <span>Mark as Completed</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PhotographerBookings;
