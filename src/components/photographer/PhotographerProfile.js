import { useEffect, useState } from "react";
import { getPhotographerProfile, updatePhotographerProfile } from "../../services/api";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiEdit2 } from "react-icons/fi";

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

  const handleSpecializationChange = (e) => {
    const newSpecialization = e.target.value.split(",").map((s) => s.trim());
    setFormData((prevData) => ({ ...prevData, specialization: newSpecialization }));
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

    try {
      const updatedPhotographer = await updatePhotographerProfile(updatedPhotographerData, token);
      setProfileData(updatedPhotographer);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating photographer:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!profileData) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <div className="flex items-center space-x-6">
        <img
          src={profileData.profilePhoto || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
          <p className="text-gray-600 text-lg">{profileData.email}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            <FiEdit2 className="mr-2" /> Edit Profile
          </button>
        </div>
      </div>
      <div className="mt-8 text-gray-700 space-y-4">
        <p className="text-lg"><strong>Phone:</strong> {profileData.phone || "N/A"}</p>
        <p className="text-lg"><strong>Specialization:</strong> {profileData.specialization.join(", ") || "N/A"}</p>
        <p className="text-lg"><strong>Experience:</strong> {profileData.experience || "N/A"} years</p>
        <p className="text-lg"><strong>Average Rating:</strong> {profileData.averageRating || "N/A"}</p>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-8">
                <Dialog.Title className="text-2xl font-bold text-gray-800">Edit Profile</Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization.join(", ")} onChange={handleSpecializationChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                    <input type="file" onChange={handleFileChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300" disabled={uploading}>{uploading ? "Saving..." : "Save"}</button>
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PhotographerProfile;