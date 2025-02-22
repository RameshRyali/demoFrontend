import React, { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/api"; // Ensure API function is correct

const AdminProfile = ({ token }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Token passed to AdminProfile component: ", token);  // Debugging Token

  useEffect(() => {
    const fetchAdminProfile = async () => {
      console.log("Attempting to fetch admin profile..."); // Debugging before API call
      try {
        const data = await getAdminProfile(token);  // Fetch admin profile data with token
        console.log("Fetched Admin Data: ", data);  // Debugging: Log the data received from API
        setAdminData(data);  // Set admin data
        setLoading(false);  // Stop loading once data is fetched
      } catch (err) {
        console.log("Error occurred while fetching admin profile: ", err);  // Debugging API error
        setError("Failed to load admin profile");
        setLoading(false);  // Stop loading on error
      }
    };

    if (token) {
      console.log("Token exists, calling fetchAdminProfile()..."); // Debugging if token exists
      fetchAdminProfile();
    } else {
      console.log("No token found, setting error state..."); // Debugging no token case
      setLoading(false);  // If no token, stop loading
      setError("Unauthorized: No token");
    }
  }, [token]);

  // Loading state
  if (loading) {
    console.log("Admin profile is loading..."); // Debugging loading state
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.log("Error occurred: ", error); // Debugging error state
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render the admin data if it exists
  if (adminData) {
    console.log("Rendering admin profile with data: ", adminData);  // Debugging: Log admin data before rendering
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Admin Profile
          </h2>

          {/* Display Admin Info */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Name:</span>
              <span>{adminData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Email:</span>
              <span>{adminData.email}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminProfile;
