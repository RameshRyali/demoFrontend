import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCamera, FaUser } from "react-icons/fa";

const AdminDashboard = () => {
  const [totalPhotographers, setTotalPhotographers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState({});
  const [photographers, setPhotographers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [photographersResponse, usersResponse, bookingsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/photographers", config),
          axios.get("http://localhost:5000/api/admin/users", config),
          axios.get("http://localhost:5000/api/admin/bookings", config),
        ]);

        setTotalPhotographers(photographersResponse.data.length);
        const photographersMap = {};
        photographersResponse.data.forEach((photographer) => {
          photographersMap[photographer._id] = photographer.name;
        });
        setPhotographers(photographersMap);

        setTotalCustomers(usersResponse.data.length);
        const usersMap = {};
        usersResponse.data.forEach((user) => {
          usersMap[user._id] = user.name;
        });
        setUsers(usersMap);

        const bookings = bookingsResponse.data;
        const active = bookings.filter(
          (booking) => booking.status === "Pending" || booking.status === "Confirmed"
        );
        setActiveBookings(active.length);

        const sortedBookings = bookings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
        setRecentBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          icon={<FaCamera className="text-4xl mr-4 text-yellow-500" />}
          title="Total Photographers"
          value={totalPhotographers}
        />
        <SummaryCard
          icon={<FaUser className="text-4xl mr-4 text-green-500" />}
          title="Total Customers"
          value={totalCustomers}
        />
        <SummaryCard
          icon={<FaCalendarAlt className="text-4xl mr-4 text-blue-500" />}
          title="Active Bookings"
          value={activeBookings}
        />
      </div>
      <RecentBookingsTable recentBookings={recentBookings} users={users} photographers={photographers} />
    </div>
  );
};

const SummaryCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center text-gray-900">
    {icon}
    <div>
      <p className="text-gray-600 text-lg font-semibold">{title}</p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const RecentBookingsTable = ({ recentBookings, users, photographers }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Completed":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Photographer Name</th>
              <th className="py-3 px-4">Booking Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-100 transition">
                <td className="py-3 px-4">{users[booking.userId] || "Unknown User"}</td>
                <td className="py-3 px-4">{photographers[booking.photographerId] || "Unknown Photographer"}</td>
                <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getStatusBadgeColor(booking.status)}`}>{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
