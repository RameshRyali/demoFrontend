import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditUserModal from "./EditUserModal";

const Profile = ({ user, token }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return <h2 className="text-center text-xl">Loading user details...</h2>;
  }

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
        <p><strong>Address:</strong> {user.address || "N/A"}</p>
        {user.profilePhoto && (
          <div className="mt-4">
            <strong>Profile Photo:</strong>
            <img src={user.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full mt-2" />
          </div>
        )}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      </div>
      {isModalOpen && (
        <EditUserModal user={user} token={token} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Profile;
