import React, { useState, useEffect } from "react";
import { bookSession } from "../../services/api";
import { motion } from "framer-motion";

const BookSession = ({ token, photographerId }) => {
  console.log("Received token in BookSession:", token);
  console.log("Selected Photographer ID:", photographerId);

  const [formData, setFormData] = useState({
    photographerId: photographerId || "",
    date: "",
    timeSlot: "",
    location: "",
    package: {
      name: "",
      price: 0,
    },
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, photographerId }));
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
    console.log("Submitting Booking Data:", formData);
    try {
      const response = await bookSession(formData, token);
      console.log("Booking Response:", response);
      alert(response.message || "Booking successful!");
    } catch (error) {
      console.error("Booking Error:", error);
      alert(error.message || "Booking failed. Please try again.");
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md";
  const labelClasses = "text-gray-700 font-medium mb-1 flex items-center gap-2";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📸 Book Your Session
          </h2>
          <p className="text-gray-600 mt-2">Fill in the details to schedule your perfect photo session</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
            >
              <label className={labelClasses}>
                <span>📅 Session Date</span>
              </label>
              <input
                type="date"
                name="date"
                className={inputClasses}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
            >
              <label className={labelClasses}>
                <span>⏰ Time Slot</span>
              </label>
              <input
                type="text"
                name="timeSlot"
                placeholder="e.g., 10:00 AM"
                className={inputClasses}
                onChange={handleChange}
                required
              />
            </motion.div>
          </div>

          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
          >
            <label className={labelClasses}>
              <span>📍 Location</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="Enter the photo session location"
              className={inputClasses}
              onChange={handleChange}
              required
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
            >
              <label className={labelClasses}>
                <span>📦 Package Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Wedding Package"
                className={inputClasses}
                onChange={handlePackageChange}
                required
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
            >
              <label className={labelClasses}>
                <span>💰 Package Price ($)</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                className={inputClasses}
                onChange={handlePackageChange}
                required
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl mt-8 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>📸 Confirm Booking</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default BookSession;
