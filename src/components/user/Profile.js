import { useEffect, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile, updateUserProfile } from "../../services/api";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiEdit2 } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpectnvk/image/upload";
const UPLOAD_PRESET = "mediafiles";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePhoto: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const userData = await getUserProfile(token);
        setProfileData(userData);
        setFormData(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => setIsModalOpen(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let profilePhotoUrl = formData.profilePhoto;

    if (selectedFile) {
      try {
        const formDataCloud = new FormData();
        formDataCloud.append("file", selectedFile);
        formDataCloud.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formDataCloud });
        const data = await response.json();
        profilePhotoUrl = data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedUserData = { ...formData, profilePhoto: profilePhotoUrl };

    try {
      const updatedUser = await updateUserProfile(updatedUserData, token);
      setProfileData(updatedUser);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!profileData) return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-pink-800">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity }
        }}
        className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full shadow-lg shadow-blue-500/20"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-pink-800 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full backdrop-blur-2xl bg-white/10 p-10 rounded-[2rem] shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
        <div className="relative">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
            User Profile
          </motion.h2>
          <div className="flex flex-col items-center space-y-8">
            <motion.div 
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 group-hover:opacity-100 blur-xl transition-all duration-300" />
              <div className="relative">
                <img
                  src={profileData.profilePhoto || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-44 h-44 rounded-full object-cover border-4 border-white/30 shadow-2xl transform transition-transform duration-300 group-hover:rotate-6"
                />
                <motion.div 
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}>
                  <FiEdit2 className="w-5 h-5 text-purple-600" />
                </motion.div>
              </div>
            </motion.div>
            
            <div className="text-center space-y-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <p className="text-3xl font-bold text-white mb-1">
                  {profileData.name}
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-300">
                  <FiMail className="w-4 h-4" />
                  <p className="text-lg">{profileData.email}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4">
                <div className="p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <FiPhone className="w-5 h-5 text-blue-300 mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">{profileData.phone || "No phone number"}</p>
                </div>
                <div className="p-4 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <FiMapPin className="w-5 h-5 text-blue-300 mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">{profileData.address || "No address"}</p>
                </div>
              </motion.div>
            </div>

            <motion.button 
              onClick={handleEditClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3">
              <FiUser className="w-5 h-5" />
              <span>Edit Profile</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Transition show={isModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pointer-events-none opacity-50" />
                
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-10">
                    <Dialog.Title className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Edit Profile
                    </Dialog.Title>
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 group-hover:border-purple-400"
                            placeholder="Enter your name" 
                          />
                          <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                            disabled 
                          />
                          <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 group-hover:border-purple-400"
                            placeholder="Enter your phone number" 
                          />
                          <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 group-hover:border-purple-400"
                            placeholder="Enter your address" 
                          />
                          <FiMapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                      <div className="flex items-center space-x-6">
                        <motion.div 
                          className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}>
                          <img
                            src={selectedFile ? URL.createObjectURL(selectedFile) : (formData.profilePhoto || "https://via.placeholder.com/96")}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div className="flex-1">
                          <label className="relative cursor-pointer block">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 text-center">
                              Choose new photo
                            </motion.div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-8 mt-8 border-t">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={uploading}
                        className="px-10 py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 font-medium"
                      >
                        {uploading ? (
                          <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Profile;