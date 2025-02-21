import React, { useEffect, useState } from "react";
import { getUserCompletedBookingHistory } from "../../services/api"; // Ensure correct path

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token"); // Fetch token manually

    useEffect(() => {
        if (!token) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        const getHistory = async () => {
            try {
                const data = await getUserCompletedBookingHistory(token);
                if (!data || !Array.isArray(data)) {
                    throw new Error("Invalid response from server");
                }
                setBookings(data);
            } catch (err) {
                setError(err.message || "Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };

        getHistory();
    }, [token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2>Booking History</h2>
            {bookings.length === 0 ? (
                <p>No completed bookings found.</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {bookings.map((booking) => (
                        <li 
                            key={booking._id} 
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                                marginBottom: "5px",
                            }}
                        >
                            📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} | 
                            🕒 <strong>Time:</strong> {booking.timeSlot} | 
                            📸 <strong>Photographer:</strong> {booking.photographerName || "Unknown"} | 
                            ⏳ <strong>Booked On:</strong> {new Date(booking.bookedAt).toLocaleString()} |
                            🎁 <strong>Package:</strong> {booking.package?.name || "N/A"} |
                            💰 <strong>Price:</strong> ${booking.package?.price || "N/A"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
