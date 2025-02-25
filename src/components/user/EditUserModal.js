import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserProfile } from "../../services/api"; 

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpectnvk/image/upload";
const UPLOAD_PRESET = "mediafiles"; 

const EditUserModal = ({ user, token, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    profilePhoto: user.profilePhoto || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setUploading(true);
    let profilePhotoUrl = formData.profilePhoto;

    if (selectedFile) {
      try {
        const formDataCloud = new FormData();
        formDataCloud.append("file", selectedFile);
        formDataCloud.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formDataCloud,
        });

        const data = await response.json();
        profilePhotoUrl = data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const updatedUserData = { ...formData, profilePhoto: profilePhotoUrl };

    try {
      const updatedUser = await updateUserProfile(updatedUserData, token); // Use imported function
      onUpdate(updatedUser); 
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 px-4"
    >
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10"
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Edit Profile
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"/>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {[
              { label: "Name", name: "name", type: "text", icon: "👤" },
              { label: "Email", name: "email", type: "email", icon: "📧" },
              { label: "Phone", name: "phone", type: "text", icon: "📱" },
              { label: "Address", name: "address", type: "text", icon: "📍" }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 ml-1">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                </label>
                <motion.input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full p-4 rounded-2xl border-2 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 
                    bg-gray-800/30 text-white placeholder-gray-400 transition-all duration-300 outline-none
                    hover:border-gray-600/50"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 ml-1">
                <span>📸</span>
                <span>Profile Photo</span>
              </label>
              <div className="relative group">
                <motion.input
                  type="file"
                  name="profilePhoto"
                  onChange={handleFileChange}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full p-4 rounded-2xl border-2 border-gray-700/50 bg-gray-800/30 text-white
                    file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0
                    file:bg-gradient-to-r file:from-blue-500 file:via-purple-500 file:to-pink-500
                    file:text-white hover:file:opacity-90 transition-all duration-300
                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none
                    hover:border-gray-600/50"
                />
              </div>
            </div>
          </div>

          {uploading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-3 text-blue-400 bg-blue-500/10 p-3 rounded-xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
              />
              <span className="font-medium">Uploading...</span>
            </motion.div>
          )}

          <div className="flex justify-end space-x-3 mt-8">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl 
                border border-gray-700/50 transition-all duration-300
                hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-900/20"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={uploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl 
                shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                border border-white/10"
            >
              {uploading ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditUserModal;
