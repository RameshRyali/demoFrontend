// src/components/admin/AdminProfile.js
import React, { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/api";

const AdminProfile = ({ admin }) => {
 

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Profile
        </h2>
        
      </div>
    </div>
  );
};

export default AdminProfile;
