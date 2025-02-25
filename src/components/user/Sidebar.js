import React from "react";
import { FaBell, FaCamera, FaHistory, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ logout }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 text-white w-64 p-6 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-200">
          Dashboard
        </h2>
        <button
          className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          onClick={logout}
        >
          <FaSignOutAlt />
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-4">
          <li
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
            onClick={() => navigate("/dashboard/profile")}
          >
            <FaUser className="mr-3" /> Profile
          </li>
          <li
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
            onClick={() => navigate("/dashboard/history")}
          >
            <FaHistory className="mr-3" /> History
          </li>
          <li
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
            onClick={() => navigate("/dashboard/photographers")}
          >
            <FaCamera className="mr-3" /> Photographers
          </li>
          <li
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
            onClick={() => navigate("/dashboard/notifications")}
          >
            <FaBell className="mr-3" /> Notifications
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
