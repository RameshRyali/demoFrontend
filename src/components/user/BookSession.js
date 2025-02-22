// src/pages/BookSession.js
import React, { useState, useEffect } from "react";
import { bookSession } from "../../services/api";

const BookSession = ({ token, photographerId }) => {
  console.log('Received token in BookSession:', token);
  console.log('Selected Photographer ID:', photographerId);

  const [formData, setFormData] = useState({
    photographerId: photographerId || "",
    date: "",
    timeSlot: "",
    location: "",  // ✅ Added location field
    package: {
      name: "",
      price: 0,
    },
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photographerId: photographerId,
    }));
  }, [photographerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePackageChange = (e) => {
    setFormData({
      ...formData,
      package: { ...formData.package, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Booking Data:', formData);
    try {
      const response = await bookSession(formData, token);
      console.log('Booking Response:', response);
      alert(response.message || 'Booking successful!');
    } catch (error) {
      console.error('Booking Error:', error);
      alert(error.message || 'Booking failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">
        Book a Photography Session
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="date"
          name="date"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="timeSlot"
          placeholder="Time Slot (e.g., 10:00 AM)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          required
        />
        
        {/* ✅ New Input Field for Location */}
        <input
          type="text"
          name="location"
          placeholder="Enter Location"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Package Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handlePackageChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Package Price"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handlePackageChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Book Session
        </button>
      </form>
    </div>
  );
};

export default BookSession;
