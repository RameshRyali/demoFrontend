// src/pages/PhotographerDashboard.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PhotographerSidebar from './PhotographerSidebar';

const PhotographerDashboard = ({ photographer, setToken, setPhotographer }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('photographer');
    setToken(null);
    setPhotographer(null);
    navigate('/photographer/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PhotographerSidebar logout={handleLogout} photographerName={photographer.name} />
      
      <div className="flex-1 ml-64">
        {/* Main Content Area */}
        <div className="p-8">
          {/* Welcome Section */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome, {photographer.name} 
            </h1>
            <p className="text-lg text-gray-600">
              Manage your bookings, view insights, and control your dashboard.
            </p>
          </div>

          {/* Additional Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
