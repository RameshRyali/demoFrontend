import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { FiAward, FiCamera, FiEdit2, FiPhone, FiStar, FiUser } from "react-icons/fi";
import { getPhotographerProfile, updatePhotographerProfile } from "../../services/api";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpectnvk/image/upload";
const UPLOAD_PRESET = "mediafiles";

const PhotographerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: [],
    experience: "",
    profilePhoto: "",
    packages: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const photographerData = await getPhotographerProfile(token);
        setProfileData(photographerData);
        setFormData(photographerData);
      } catch (error) {
        console.error("Error fetching photographer profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSpecializationChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => {
      const specialization = prevData.specialization.includes(value)
        ? prevData.specialization.filter((spec) => spec !== value)
        : [...prevData.specialization, value];
      return { ...prevData, specialization };
    });
  };

  const handlePackageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPackages = [...formData.packages];
    updatedPackages[index][name] = value;
    setFormData((prevData) => ({ ...prevData, packages: updatedPackages }));
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

    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedPhotographerData = { ...formData, profilePhoto: profilePhotoUrl };
    console.log("Updated Photographer Data:", updatedPhotographerData);

    try {
      const updatedPhotographer = await updatePhotographerProfile(updatedPhotographerData, token);
      setProfileData(updatedPhotographer.photographer);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating photographer:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!profileData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="h-3 w-36 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const events = ["Wedding", "Engagement", "Lifestyle", "Birthday", "BabyShoot", "CollegeEvents", "Nightshoot", "CorporateEvents"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <div className="max-w-5xl w-full mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 p-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="relative w-40 h-40">
              <img
                src={profileData.profilePhoto || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover rounded-2xl shadow-lg ring-4 ring-white/50"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-2xl flex items-center justify-center">
                <FiEdit2 className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" size={24} />
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">{profileData.name}</h2>
              <p className="text-lg text-gray-600 font-medium">{profileData.email}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FiEdit2 className="mr-2" /> Edit Profile
              </motion.button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <FiPhone className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <p className="text-lg text-gray-800">{profileData.phone || "N/A"}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <FiCamera className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Specialization</p>
                    <p className="text-lg text-gray-800">{profileData.specialization?.join(", ") || "N/A"}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <FiAward className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Experience</p>
                    <p className="text-lg text-gray-800">{profileData.experience || "N/A"} years</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <FiStar className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                    <p className="text-lg text-gray-800">{profileData.averageRating || "N/A"}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Package Details Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <FiCamera className="text-blue-600 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Specialization</p>
                        <p className="text-lg text-gray-800">{pkg.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-blue-600 text-xl">₹</span>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Price</p>
                        <p className="text-lg text-gray-800">{pkg.price}</p>
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-3">
                      <FiClock className="text-blue-600 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Duration</p>
                        <p className="text-lg text-gray-800">{pkg.duration}</p>
                      </div>
                    </div> */}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 pointer-events-none" />

                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-8">
                      <Dialog.Title className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Edit Profile
                      </Dialog.Title>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                      >
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your name"
                            />
                            <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter phone number"
                            />
                            <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Years of experience"
                            />
                            <FiAward className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Specialization</label>
                          <div className="flex flex-wrap gap-2">
                            {events.map((event) => (
                              <button
                                key={event}
                                type="button"
                                onClick={handleSpecializationChange}
                                value={event}
                                className={`px-4 py-2 border rounded-xl transition-colors duration-200 ${
                                  formData.specialization.includes(event)
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                                }`}
                              >
                                {event}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                        <div className="flex items-center space-x-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={selectedFile ? URL.createObjectURL(selectedFile) : (formData.profilePhoto || "https://via.placeholder.com/80")}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="relative cursor-pointer">
                              <input
                                type="file"
                                onChange={handleFileChange}
                                className="sr-only"
                              />
                              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-sm text-gray-700 text-center">
                                Choose new photo
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Package Details Section */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Packages</label>
                        {formData.packages.map((pkg, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Specialization</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="specialization"
                                  value={pkg.specialization}
                                  onChange={(e) => handlePackageChange(index, e)}
                                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  placeholder="e.g. Portrait, Wedding, Nature"
                                />
                                <FiCamera className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Price</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="price"
                                  value={pkg.price}
                                  onChange={(e) => handlePackageChange(index, e)}
                                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  placeholder="Enter price"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                              </div>
                            </div>
                            {/* <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Duration</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="duration"
                                  value={pkg.duration}
                                  onChange={(e) => handlePackageChange(index, e)}
                                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  placeholder="Enter duration"
                                />
                                <FiClock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>
                            </div> */}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-4 pt-6 mt-8 border-t">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={uploading}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 font-medium shadow-lg shadow-blue-500/25"
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
          </div>
        </Dialog>
      </Transition>

    </motion.div>
  );
};

export default PhotographerProfile;
