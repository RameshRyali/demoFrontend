import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = ({ user, setToken, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
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
    navigate("/login");
  };

  if (loading) {
    return <h1 className="text-center text-xl mt-10">Checking authentication...</h1>;
  }

  return (
    <div className="flex">
      <Sidebar logout={handleLogout} />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name || "Guest"}
        </h2>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
