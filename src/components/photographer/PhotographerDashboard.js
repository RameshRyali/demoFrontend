// src/pages/PhotographerDashboard.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PhotographerSidebar from '../photographer/PhotographerSidebar';

const PhotographerDashboard = ({ photographer, setToken, setPhotographer }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('photographer');
    setToken(null);
    setPhotographer(null);
    navigate('/login');
  };

  return (
    <div className="flex">
      <PhotographerSidebar logout={handleLogout} />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {photographer.name}</h2>
        <Outlet />
      </div>
    </div>
  );
};

export default PhotographerDashboard;
