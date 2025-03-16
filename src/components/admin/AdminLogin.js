import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from "../../services/api";
import Navbar from '../Home/Navbar'; // Adjust the import path as necessary
import Footer from '../Home/footer'; // Adjust the import path as necessary

const AdminLogin = ({ setToken, setAdmin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAdmin(formData);
      setToken(response.token);
      setAdmin(response.admin);

      // Store token and admin data in local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('admin', JSON.stringify(response.admin));

      navigate('/Sidebar'); // Redirect to admin dashboard
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            Admin Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-5 py-4 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
