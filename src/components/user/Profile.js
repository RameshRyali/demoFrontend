import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/api"; // Ensure correct path

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
        console.log("Fetched User Data:", userData);
        setProfileData(userData);
        setFormData(userData); // Pre-fill form data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

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

    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedUserData = { ...formData, profilePhoto: profilePhotoUrl };

    try {
      const updatedUser = await updateUserProfile(updatedUserData, token);
      setProfileData(updatedUser); // Update state with new profile data
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!profileData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      <div className="bg-white p-4 rounded shadow">
        <img
          src={profileData.profilePhoto || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Phone:</strong> {profileData.phone || "N/A"}</p>
        <p><strong>Address:</strong> {profileData.address || "N/A"}</p>
        <button
          onClick={handleEditClick}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Profile Photo</label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {uploading && <p className="text-blue-600">Uploading...</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
