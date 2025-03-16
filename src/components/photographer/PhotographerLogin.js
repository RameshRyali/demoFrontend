import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPhotographer } from '../../services/api';
import Navbar from '../Home/Navbar'; // Adjust the import path as necessary
import Footer from '../Home/footer'; // Adjust the import path as necessary

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
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Welcome back, Photographer!
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
            >
              Login
            </button>
          </form>
          {/* <p className="text-center text-gray-700 text-sm mt-6">
            Don't have an account?{' '}
            <a href="/photographer/register" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PhotographerLogin;
