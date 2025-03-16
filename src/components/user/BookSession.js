import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { bookSession } from "../../services/api";

const BookSession = ({ token, photographerId, photographerSpecializations, packages }) => {
  console.log("Received token in BookSession:", token);
  console.log("Selected Photographer ID:", photographerId);

  const [formData, setFormData] = useState({
    photographerId: photographerId || "",
    date: "",
    timeSlot: "",
    location: "",
    eventDuration: "",
    event: "",
  });

  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, photographerId }));
  }, [photographerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePackageChange = (specialization) => {
    const selected = packages.find(pkg => pkg.specialization === specialization);
    setSelectedPackage(selected);
    setFormData({
      ...formData,
      event: specialization,
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
          <div className="space-y-4">
            <label className={labelClasses}>
              <span>Events</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {photographerSpecializations.map((specialization, index) => (
                <motion.button
                  key={index}
                  type="button"
                  className={`px-4 py-2 rounded-xl border ${formData.event === specialization ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white'} transition-all duration-200`}
                  onClick={() => handlePackageChange(specialization)}
                  whileHover={{ scale: 1.05 }}
                >
                  {specialization}
                </motion.button>
              ))}
            </div>
          </div>

          {selectedPackage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className={labelClasses}>
                    <span>Event Price per day </span>
                  </label>
                  <input
                    type="number"
                    value={selectedPackage.price}
                    className={inputClasses}
                    readOnly
                  />
                </motion.div>

                {/* <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className={labelClasses}>
                    <span>Package Duration</span>
                  </label>
                  <input
                    type="text"
                    value={selectedPackage.duration}
                    className={inputClasses}
                    readOnly
                  />
                </motion.div> */}
              </div>
            </div>
          )}

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

          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
          >
            <label className={labelClasses}>
              <span>Event Duration (days)</span>
            </label>
            <input
              type="number"
              name="eventDuration"
              value={formData.eventDuration}
              className={inputClasses}
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl mt-8 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Pay Now</span>
          </motion.button>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl mt-8 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>📸 Book now</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default BookSession;
