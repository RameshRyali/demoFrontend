// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleUserLoginClick = () => {
    navigate('/user/login');
  };

  const handlePhotographerLoginClick = () => {
    navigate('/photographer/login');
  };

  const handleAdminLoginClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to PhotoBooking App</h1>
        <p className="text-lg mb-8">Your ultimate solution for booking photography sessions.</p>
        <button
          onClick={handleUserLoginClick}
          className="bg-black-600 text-black py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 mr-2"
        >
          User Login
        </button>
        <button
          onClick={handlePhotographerLoginClick}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 mr-2"
        >
          Photographer Login
        </button>
        <button
          onClick={handleAdminLoginClick}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
