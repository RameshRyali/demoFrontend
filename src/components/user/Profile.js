import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserProfile, updateUserProfile } from "../../services/api";

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

  if (!profileData) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-gray-800 p-8 rounded-3xl shadow-lg text-center border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">User Profile</h2>
        <div className="flex flex-col items-center">
          <motion.img
            src={profileData.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 shadow-lg transition-transform transform hover:scale-110"
          />
          <p className="text-xl font-semibold text-white">{profileData.name}</p>
          <p className="text-gray-400">{profileData.email}</p>
          <p className="text-gray-400">{profileData.phone || "N/A"}</p>
          <p className="text-gray-400">{profileData.address || "N/A"}</p>
          <button 
            onClick={handleEditClick} 
            className="mt-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all">
            Edit Profile
          </button>
        </div>
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" placeholder="Name" />
              <input type="email" name="email" value={formData.email} className="w-full p-3 border rounded-lg bg-gray-600 text-gray-400 cursor-not-allowed" disabled />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" placeholder="Phone" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" placeholder="Address" />
              <input type="file" name="profilePhoto" onChange={handleFileChange} className="w-full p-3 border rounded-lg bg-gray-700 text-white" />
              {uploading && <p className="text-blue-400">Uploading...</p>}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg transition" disabled={uploading}>{uploading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
