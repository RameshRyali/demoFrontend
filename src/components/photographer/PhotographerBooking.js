import React, { useEffect, useState } from 'react';
import { getPhotographerBookings, updateBookingStatus } from '../../services/api';

const PhotographerBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getPhotographerBookings(token);
        console.log("Fetched Bookings:", data);  // ✅ Debugging API response
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [token]);

  const handleStatusChange = async (bookingId, selectedStatus) => {
    const validStatuses = ["Pending", "Confirmed", "Completed", "Canceled"];
    
    if (!validStatuses.includes(selectedStatus)) {
      console.error("Invalid status value:", selectedStatus);
      return;
    }
  
    try {
      await updateBookingStatus(bookingId, selectedStatus);
      console.log(`Booking status updated to ${selectedStatus}!`);

      // ✅ Update UI instantly by modifying the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: selectedStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bookings</h2>

      {/* Show message if no bookings */}
      {bookings.length === 0 && <p>No bookings available.</p>}

      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li key={booking._id} className="border p-4 rounded shadow flex items-center space-x-4">
            
            {/* ✅ Display User Profile Photo */}
            {booking.userId?.profilePhoto ? (
              <img 
                src={booking.userId.profilePhoto} 
                alt="User Profile" 
                className="w-12 h-12 rounded-full border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm text-gray-600">No Photo</span>
              </div>
            )}

            <div>
              <p><strong>User:</strong> {booking.userId?.name || "Unknown"}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
              <p><strong>Package:</strong> {booking.package?.name || "N/A"}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {/* Accept and Reject Buttons for Pending Bookings */}
              {booking.status.toLowerCase() === "pending" && (
                <div className="mt-2 space-x-2">
                  <button 
                    onClick={() => handleStatusChange(booking._id, "Confirmed")}
                    className="bg-green-500 text-white px-3 py-1 rounded border border-black p-2"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatusChange(booking._id, "Canceled")}
                    className="bg-red-500 text-white px-3 py-1 rounded border border-black p-2"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Completed Button for Confirmed Bookings */}
              {booking.status.toLowerCase() === "confirmed" && (
                <div className="mt-2">
                  <button 
                    onClick={() => handleStatusChange(booking._id, "Completed")}
                    className="bg-blue-500 text-white px-3 py-1 rounded border border-black p-2"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotographerBookings;
