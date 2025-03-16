import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FiAward, FiCamera, FiLock, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { registerPhotographer } from '../../services/api';
import Navbar from '../Home/Navbar'; // Adjust the import path as necessary
import Footer from '../Home/footer'; // Adjust the import path as necessary

const PhotographerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '', // Keep as string for input
    experience: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert specialization string to array
    const updatedFormData = {
      ...formData,
      specialization: formData.specialization
        .split(',') // Split by comma
        .map(spec => spec.trim()) // Trim whitespace
        .filter(spec => spec.length > 0), // Remove empty strings
    };

    try {
      const response = await registerPhotographer(updatedFormData);
      alert(response.message);
      navigate('/photographer/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl border border-gray-200"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
            >
              <FiCamera className="text-gray-500 text-4xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Creative Community
            </h2>
            <p className="text-gray-600">Start your journey as a Professional Photographer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input type="text" name="name" placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleChange} required />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input type="email" name="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleChange} required />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input type="password" name="password" placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleChange} required />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-500" />
                </div>
                <input type="text" name="phone" placeholder="Phone Number" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleChange} required />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiCamera className="text-gray-500" />
                </div>
                <input type="text" name="specialization" placeholder="Specialization (e.g., Wedding, Portrait)" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleChange} required />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiAward className="text-gray-500" />
                </div>
                <input type="number" name="experience" placeholder="Years of Experience" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" onChange={handleChange} required />
              </div>
            </motion.div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 mt-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300">
              Create Account
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <motion.a whileHover={{ scale: 1.05 }} href="/photographer/login" className="text-blue-600 hover:text-blue-500">
                Sign In
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default PhotographerRegister;
