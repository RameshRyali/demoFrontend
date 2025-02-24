import React, { useEffect, useState } from "react";
import { getUserCompletedBookingHistory } from "../../services/api";
import RatePhotographer from "./RatePhotographer";

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

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10 px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">📜 Booking History</h2>
            
            {bookings.length === 0 ? (
                <p className="text-gray-500 text-lg">No completed bookings found.</p>
            ) : (
                <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                        const photographerId = booking.photographerId?._id || booking.photographerId || null;

                        return (
                            <div 
                                key={booking._id} 
                                className="bg-white shadow-md hover:shadow-lg rounded-lg p-5 border border-gray-200 transition-transform hover:-translate-y-1"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">📷 {booking.photographerName || "Unknown"}</h3>
                                <p className="text-gray-600">📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p className="text-gray-600">🕒 <strong>Time:</strong> {booking.timeSlot}</p>
                                <p className="text-gray-600">⏳ <strong>Booked On:</strong> {new Date(booking.bookedAt).toLocaleString()}</p>
                                <p className="text-gray-600">🎁 <strong>Package:</strong> {booking.package?.name || "N/A"}</p>
                                <p className="text-gray-600">💰 <strong>Price:</strong> ${booking.package?.price || "N/A"}</p>
                                
                                {booking.status === "Completed" && photographerId && (
                                    <button
                                        onClick={() => setSelectedBooking({ ...booking, photographerId })}
                                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all text-sm font-medium"
                                    >
                                        ⭐ Rate Photographer
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedBooking && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center relative">
                        <button 
                            onClick={() => setSelectedBooking(null)} 
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
                        >
                            ✖
                        </button>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Rate Photographer</h3>
                        <p className="text-gray-600 text-sm mb-4">Share your experience and help others choose the best!</p>
                        <RatePhotographer
                            photographerId={selectedBooking.photographerId}
                            bookingId={selectedBooking._id}
                            userId={selectedBooking.userId}
                            token={token}
                            onClose={() => setSelectedBooking(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
