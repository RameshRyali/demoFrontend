// src/pages/PhotographerLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPhotographer } from '../../services/api';

const PhotographerLogin = ({ setToken, setPhotographer }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginPhotographer(formData);
      setToken(response.token);
      setPhotographer(response.photographer);
  
      // Store token and photographer data in local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('photographer', JSON.stringify(response.photographer));
  
      navigate('/photographer-dashboard/profile'); // ✅ Redirect to correct route
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Photographer Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{' '}
          <a href="/photographer/register" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default PhotographerLogin;
