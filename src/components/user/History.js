import React, { useEffect, useState } from "react";
import { getUserCompletedBookingHistory } from "../../services/api";
import RatePhotographer from "./RatePhotographer";
import { motion, AnimatePresence } from "framer-motion";

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        const fetchBookingHistory = async () => {
            try {
                const data = await getUserCompletedBookingHistory(token);
                if (!Array.isArray(data)) {
                    throw new Error("Invalid server response");
                }
                setBookings(data);
            } catch (err) {
                setError(err.message || "Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, [token]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white text-xl font-medium">Loading your memories...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center max-w-md mx-auto">
                <div className="text-red-400 text-5xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
                <p className="text-gray-300">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 mb-4">
                            Your Photography Journey
                        </h2>
                        <p className="text-gray-300 text-lg">Relive your memorable photography sessions</p>
                    </motion.div>
                </div>

                {bookings.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto"
                    >
                        <div className="text-6xl mb-4">📸</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Completed Sessions Yet</h3>
                        <p className="text-gray-300">Your photography adventures will appear here once completed.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {bookings.map((booking, index) => {
                            const photographerId = booking.photographerId?._id || booking.photographerId || null;

                            return (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 blur"></div>
                                    <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02]">
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                                        
                                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="text-2xl">�</span>
                                            {booking.photographerName || "Unknown"}
                                        </h3>
                                        
                                        <div className="space-y-3 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-300">📅</span>
                                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-purple-300">🕒</span>
                                                <span>{booking.timeSlot}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-pink-300">🎁</span>
                                                <span>{booking.package?.name || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-300">💰</span>
                                                <span>${booking.package?.price || "N/A"}</span>
                                            </div>
                                        </div>

                                        {booking.status === "Completed" && photographerId && (
                                            <button
                                                onClick={() => setSelectedBooking({ ...booking, photographerId })}
                                                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium 
                                                         transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25
                                                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                                            >
                                                ⭐ Rate Your Experience
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            {/* Rating Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-lg 
                                     border border-white/20 relative"
                        >
                            <button 
                                onClick={() => setSelectedBooking(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-white mb-2">Rate Your Experience</h3>
                                <p className="text-gray-300 mb-6">Your feedback helps our community grow!</p>
                            </div>
                            
                            <RatePhotographer
                                photographerId={selectedBooking.photographerId}
                                bookingId={selectedBooking._id}
                                userId={selectedBooking.userId}
                                token={token}
                                onClose={() => setSelectedBooking(null)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default History;