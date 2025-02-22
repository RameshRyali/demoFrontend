import React, { useEffect, useState } from "react";
import { getUserCompletedBookingHistory } from "../../services/api"; // Ensure correct API path
import RatePhotographer from "./RatePhotographer"; // Import rating component

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null); // Track selected booking for rating
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

                console.log("API Response:", JSON.stringify(data, null, 2)); // Log full API response

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
                    {bookings.map((booking) => {
                        // Extract Photographer ID from API response
                        const photographerId =
                            booking.photographerId?._id ||  // Case: API returns `photographerId` as an object
                            booking.photographerId ||       // Case: API directly includes `photographerId`
                            null;                           // Default to null if missing

                        console.log(`Booking ID: ${booking._id}, Extracted Photographer ID: ${photographerId}`);

                        return (
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

                                {/* Show Rate Photographer button only for completed bookings */}
                                {booking.status === "Completed" && photographerId ? (
                                    <button
                                        onClick={() => {
                                            console.log("Selected Booking for Rating:", booking);
                                            console.log("Using Photographer ID:", photographerId); // ✅ Ensure correct ID is used

                                            setSelectedBooking({
                                                ...booking,
                                                photographerId: photographerId, // ✅ Ensure extracted ID is passed
                                            });
                                        }}
                                    >
                                        ⭐ Rate Photographer
                                    </button>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Show rating modal when a booking is selected */}
            {selectedBooking && (
                <RatePhotographer
                    photographerId={selectedBooking.photographerId}
                    bookingId={selectedBooking._id}
                    userId={selectedBooking.userId} // Ensure userId is passed correctly
                    token={token}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default History;
