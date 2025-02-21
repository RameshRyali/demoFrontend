// src/components/admin/AdminDashboard.js
import React from "react";
import Sidebar from "./Sidebar";

const AdminDashboard = ({ admin, token, setToken, setAdmin }) => {
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setAdmin(null);
    window.location.href = "/"; // Redirect to home
  };

  return (
    <div className="flex">
      <Sidebar logout={handleLogout} />
      <div className="flex-1 p-4">
        {/* Content will be rendered based on the selected route */}
      </div>
    </div>
  );
};

export default AdminDashboard;
