// src/components/PhotographerSidebar.js
import React from 'react';
import { FaBell, FaCalendar, FaImages, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PhotographerSidebar = ({ logout }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 text-white w-64 p-4 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-200 mb-4">
          Photographer Dashboard
        </h2>
      </div>
      <nav>
        <ul className="space-y-4">
          <li
            className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/photographer-dashboard/profile')}
          >
            <FaUser className="mr-2" /> Profile
          </li>
          <li
            className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/photographer-dashboard/bookings')}
          >
            <FaCalendar className="mr-2" /> Bookings
          </li>
          <li
            className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/photographer-dashboard/portfolio')}
          >
            <FaImages className="mr-2" /> Portfolio
          </li>
          <li
            className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/photographer-dashboard/notifications')}
          >
            <FaBell className="mr-2" /> Notifications
          </li>
          <li
            className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={logout}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </li>
        </ul>
      </nav>
    </div>
  );
};


export default PhotographerSidebar;
