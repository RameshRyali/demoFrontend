import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = ({ user, setToken, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      navigate("/login"); // Redirect if no user found
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear(); // Clears token, user, and all other data
    setToken(null);
    setUser(null);
    navigate("/user/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">🔄 Checking authentication...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar logout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome, {user?.name || "Guest"} 🎉
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Manage your bookings, view insights, and control your dashboard.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
