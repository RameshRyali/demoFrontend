import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FiAward,
  FiCamera,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

const AddPhotographer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: [],
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecializationChange = (value) => {
    setFormData((prevData) => {
      const specialization = prevData.specialization.includes(value)
        ? prevData.specialization.filter((spec) => spec !== value)
        : [...prevData.specialization, value];
      return { ...prevData, specialization };
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.phone.length < 10) newErrors.phone = "Enter a valid phone number";
    if (formData.specialization.length === 0) newErrors.specialization = "Select at least one specialization";
    if (!formData.experience || formData.experience < 1) newErrors.experience = "Enter valid experience";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/register-photographer", formData);
      setSuccessMessage(response.data.message);
      setFormData({ name: "", email: "", password: "", phone: "", specialization: [], experience: "" });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const specializations = ["Wedding", "Engagement", "Lifestyle", "Birthday", "BabyShoot", "Nightshoot", "CorporateEvents"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-gray-900 bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-gray-700"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <FiCamera className="text-white text-4xl" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-white">Add Photographer</h2>
          <p className="text-gray-400">Fill in the details to register a new photographer</p>
        </div>

        {successMessage && <motion.div className="bg-green-500 text-white px-4 py-3 rounded-md mb-4 flex items-center"><FiCheckCircle className="mr-2" /> {successMessage}</motion.div>}
        {errorMessage && <motion.div className="bg-red-500 text-white px-4 py-3 rounded-md mb-4 flex items-center"><FiXCircle className="mr-2" /> {errorMessage}</motion.div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[{ name: "name", icon: FiUser, placeholder: "Full Name" },
            { name: "email", icon: FiMail, placeholder: "Email Address", type: "email" },
            { name: "password", icon: FiLock, placeholder: "Password", type: "password" },
            { name: "phone", icon: FiPhone, placeholder: "Phone Number" },
            { name: "experience", icon: FiAward, placeholder: "Years of Experience", type: "number" }].map(({ name, icon: Icon, placeholder, type = "text" }, index) => (
            <div key={index} className="relative">
              <input type={type} name={name} placeholder={placeholder} className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData[name]} onChange={handleChange} required />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-300">Specialization</label>
            <div className="grid grid-cols-2 gap-2">
              {specializations.map((event) => (
                <button key={event} type="button" onClick={() => handleSpecializationChange(event)} className={`px-4 py-2 border rounded-xl transition-all ${formData.specialization.includes(event) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"}`}>
                  {event}
                </button>
              ))}
            </div>
          </div>

          <motion.button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:opacity-90 transition-all" disabled={loading}>
            {loading ? "Adding..." : "Add Photographer"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPhotographer;