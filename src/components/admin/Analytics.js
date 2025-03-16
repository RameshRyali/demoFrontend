import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPhotographers, setTotalPhotographers] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [userGrowth, setUserGrowth] = useState([]);
  const [photographerGrowth, setPhotographerGrowth] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({});
  const [bookingTrends, setBookingTrends] = useState([]);
  const [photographerSpecializations, setPhotographerSpecializations] = useState({});
  const [topUsers, setTopUsers] = useState([]);
  const [topPhotographers, setTopPhotographers] = useState([]);
  const [users, setUsers] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showPhotographerDetails, setShowPhotographerDetails] = useState(false);
  const [showActiveBookingsDetails, setShowActiveBookingsDetails] = useState(false);

  // Fetch data from backend
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

        // Fetch all users
        const usersResponse = await axios.get(
          "http://localhost:5000/api/admin/users",
          config
        );
        setTotalUsers(usersResponse.data.length);
        setUserGrowth(calculateGrowth(usersResponse.data)); // Calculate user growth over time
        setUsers(usersResponse.data);

        // Fetch all photographers
        const photographersResponse = await axios.get(
          "http://localhost:5000/api/admin/photographers",
          config
        );
        setTotalPhotographers(photographersResponse.data.length);
        setPhotographerGrowth(calculateGrowth(photographersResponse.data)); // Calculate photographer growth over time
        setPhotographerSpecializations(
          calculateSpecializations(photographersResponse.data)
        ); // Calculate photographer specializations
        setPhotographers(photographersResponse.data);

        // Fetch all bookings
        const bookingsResponse = await axios.get(
          "http://localhost:5000/api/admin/bookings",
          config
        );
        const bookings = bookingsResponse.data;
        setActiveBookings(
          bookings.filter(
            (booking) =>
              booking.status === "Pending" || booking.status === "Confirmed"
          ).length
        );
        setCompletedBookings(
          bookings.filter((booking) => booking.status === "Completed").length
        );
        setBookingStatus(calculateBookingStatus(bookings)); // Calculate booking status distribution
        setBookingTrends(calculateBookingTrends(bookings)); // Calculate booking trends over time
        setTopUsers(calculateTopUsers(bookings, usersResponse.data)); // Calculate top users
        setTopPhotographers(
          calculateTopPhotographers(bookings, photographersResponse.data)
        ); // Calculate top photographers
        setBookings(bookings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper functions for calculations
  const calculateGrowth = (data) => {
    // Mock growth calculation (replace with actual logic)
    return [10, 20, 30, 40, 50, 60, 70];
  };

  const calculateBookingStatus = (bookings) => {
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
    };
    bookings.forEach((booking) => {
      statusCounts[booking.status]++;
    });
    return statusCounts;
  };

  const calculateBookingTrends = (bookings) => {
    // Mock trends calculation (replace with actual logic)
    return [5, 10, 15, 20, 25, 30, 35];
  };

  const calculateSpecializations = (photographers) => {
    const specializations = {};
    photographers.forEach((photographer) => {
      photographer.specialization.forEach((spec) => {
        specializations[spec] = (specializations[spec] || 0) + 1;
      });
    });
    return specializations;
  };

  const calculateTopUsers = (bookings, users) => {
    const userBookings = {};
    bookings.forEach((booking) => {
      userBookings[booking.userId] = (userBookings[booking.userId] || 0) + 1;
    });
    return users
      .map((user) => ({
        name: user.name,
        bookings: userBookings[user._id] || 0,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5); // Top 5 users
  };

  const calculateTopPhotographers = (bookings, photographers) => {
    const photographerBookings = {};
    bookings.forEach((booking) => {
      photographerBookings[booking.photographerId] =
        (photographerBookings[booking.photographerId] || 0) + 1;
    });
    return photographers
      .map((photographer) => ({
        name: photographer.name,
        bookings: photographerBookings[photographer._id] || 0,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5); // Top 5 photographers
  };

  // Chart data
  const userGrowthChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "User Growth",
        data: userGrowth,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const bookingStatusChartData = {
    labels: Object.keys(bookingStatus),
    datasets: [
      {
        label: "Booking Status",
        data: Object.values(bookingStatus),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const photographerSpecializationsChartData = {
    labels: Object.keys(photographerSpecializations),
    datasets: [
      {
        label: "Photographer Specializations",
        data: Object.values(photographerSpecializations),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Users"
          value={totalUsers}
          icon="👤"
          color="bg-blue-500"
          onClick={() => setShowUserDetails(!showUserDetails)}
          isActive={showUserDetails}
        />
        <SummaryCard
          title="Total Photographers"
          value={totalPhotographers}
          icon="📷"
          color="bg-green-500"
          onClick={() => setShowPhotographerDetails(!showPhotographerDetails)}
          isActive={showPhotographerDetails}
        />
        <SummaryCard
          title="Active Bookings"
          value={activeBookings}
          icon="📅"
          color="bg-yellow-500"
          onClick={() => setShowActiveBookingsDetails(!showActiveBookingsDetails)}
          isActive={showActiveBookingsDetails}
        />
        <SummaryCard title="Completed Bookings" value={completedBookings} icon="✅" color="bg-purple-500" />
      </div>

      {/* User Details */}
      {showUserDetails && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Details</h2>
          <UserDetailsTable users={users} bookings={bookings} />
        </div>
      )}

      {/* Photographer Details */}
      {showPhotographerDetails && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Photographer Details</h2>
          <PhotographerDetailsTable photographers={photographers} bookings={bookings} />
        </div>
      )}

      {/* Active Bookings Details */}
      {showActiveBookingsDetails && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Active Bookings Details</h2>
          <ActiveBookingsTable bookings={bookings} users={users} photographers={photographers} />
        </div>
      )}

      {/* User Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisCard title="User Growth Over Time" color="bg-blue-100">
            <Line data={userGrowthChartData} />
          </AnalysisCard>
          <AnalysisCard title="Top Users" color="bg-purple-100">
            <ul>
              {topUsers.map((user, index) => (
                <li key={index} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">{user.name}</span>
                  <span className="text-gray-600">{user.bookings} bookings</span>
                </li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      </div>

      {/* Photographer Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Photographer Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisCard title="Photographer Specializations" color="bg-green-100">
            <Bar data={photographerSpecializationsChartData} />
          </AnalysisCard>
          <AnalysisCard title="Top Photographers" color="bg-yellow-100">
            <ul>
              {topPhotographers.map((photographer, index) => (
                <li key={index} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">{photographer.name}</span>
                  <span className="text-gray-600">{photographer.bookings} bookings</span>
                </li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      </div>

      {/* Booking Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Booking Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisCard title="Booking Status Distribution" color="bg-red-100">
            <Pie data={bookingStatusChartData} />
          </AnalysisCard>
          <AnalysisCard title="Booking Trends Over Time" color="bg-pink-100">
            <Line data={userGrowthChartData} /> {/* Reuse user growth chart for demo */}
          </AnalysisCard>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, onClick, isActive, color }) => (
  <div
    className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
      isActive ? `border-2 ${color}` : "border border-gray-200"
    }`}
    style={{ backgroundColor: isActive ? color : "white" }}
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="text-3xl mr-4 text-white">{icon}</span>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

// Analysis Card Component
const AnalysisCard = ({ title, children, color }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md border ${color} border-gray-200`}>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    {children}
  </div>
);

// User Details Table Component
const UserDetailsTable = ({ users, bookings }) => {
  const calculateUserBookingStatus = (userId) => {
    const userBookings = bookings.filter((booking) => booking.userId === userId);
    const statusCounts = {
      Accepted: 0,
      Completed: 0,
      Pending: 0,
      Cancelled: 0,
    };
    userBookings.forEach((booking) => {
      statusCounts[booking.status]++;
    });
    return statusCounts;
  };

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-gray-800">User Name</th>
          <th className="py-2 px-4 border-b text-gray-800">Total Bookings</th>
          <th className="py-2 px-4 border-b text-gray-800">Accepted</th>
          <th className="py-2 px-4 border-b text-gray-800">Completed</th>
          <th className="py-2 px-4 border-b text-gray-800">Pending</th>
          <th className="py-2 px-4 border-b text-gray-800">Cancelled</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const bookingStatus = calculateUserBookingStatus(user._id);
          return (
            <tr key={user._id} className={bookingStatus.Cancelled > 0 ? "bg-red-100" : ""}>
              <td className="py-2 px-4 border-b text-gray-800">{user.name}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Accepted + bookingStatus.Completed + bookingStatus.Pending + bookingStatus.Cancelled}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Accepted}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Completed}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Pending}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Cancelled}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Photographer Details Table Component
const PhotographerDetailsTable = ({ photographers, bookings }) => {
  const calculatePhotographerBookingStatus = (photographerId) => {
    const photographerBookings = bookings.filter(
      (booking) => booking.photographerId === photographerId
    );
    const statusCounts = {
      Accepted: 0,
      Completed: 0,
      Pending: 0,
      Cancelled: 0,
    };
    photographerBookings.forEach((booking) => {
      statusCounts[booking.status]++;
    });
    return statusCounts;
  };

  const calculateSpecializationBookings = (photographerId, specialization) => {
    return bookings.filter(
      (booking) =>
        booking.photographerId === photographerId &&
        booking.specialization === specialization
    ).length;
  };

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-gray-800">Photographer Name</th>
          <th className="py-2 px-4 border-b text-gray-800">Total Bookings</th>
          <th className="py-2 px-4 border-b text-gray-800">Rating</th>
          <th className="py-2 px-4 border-b text-gray-800">Accepted</th>
          <th className="py-2 px-4 border-b text-gray-800">Completed</th>
          <th className="py-2 px-4 border-b text-gray-800">Cancelled</th>
        </tr>
      </thead>
      <tbody>
        {photographers.map((photographer) => {
          const bookingStatus = calculatePhotographerBookingStatus(photographer._id);
          const specializationBookings = photographer.specialization.map((spec) => ({
            specialization: spec,
            count: calculateSpecializationBookings(photographer._id, spec),
          }));
          return (
            <tr key={photographer._id} className={bookingStatus.Cancelled > 0 ? "bg-red-100" : ""}>
              <td className="py-2 px-4 border-b text-gray-800">{photographer.name}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Accepted + bookingStatus.Completed + bookingStatus.Pending + bookingStatus.Cancelled}</td>
              <td className="py-2 px-4 border-b text-gray-800">{photographer.averageRating}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Accepted}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Completed}</td>
              <td className="py-2 px-4 border-b text-gray-800">{bookingStatus.Cancelled}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Active Bookings Table Component
const ActiveBookingsTable = ({ bookings, users, photographers }) => {
  const activeBookings = bookings.filter(
    (booking) => booking.status === "Pending" || booking.status === "Confirmed"
  );

  const getUserName = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown";
  };

  const getPhotographerName = (photographerId) => {
    const photographer = photographers.find((photographer) => photographer._id === photographerId);
    return photographer ? photographer.name : "Unknown";
  };

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-gray-800">User Name</th>
          <th className="py-2 px-4 border-b text-gray-800">Photographer Name</th>
          <th className="py-2 px-4 border-b text-gray-800">Event</th>
          <th className="py-2 px-4 border-b text-gray-800">Date</th>
          <th className="py-2 px-4 border-b text-gray-800">Time Slot</th>
          <th className="py-2 px-4 border-b text-gray-800">Location</th>
        </tr>
      </thead>
      <tbody>
        {activeBookings.map((booking) => (
          <tr key={booking._id}>
            <td className="py-2 px-4 border-b text-gray-800">{getUserName(booking.userId)}</td>
            <td className="py-2 px-4 border-b text-gray-800">{getPhotographerName(booking.photographerId)}</td>
            <td className="py-2 px-4 border-b text-gray-800">{booking.event}</td>
            <td className="py-2 px-4 border-b text-gray-800">{new Date(booking.date).toLocaleDateString()}</td>
            <td className="py-2 px-4 border-b text-gray-800">{booking.timeSlot}</td>
            <td className="py-2 px-4 border-b text-gray-800">{booking.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Analytics;
