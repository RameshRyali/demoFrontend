// src/components/admin/ManagePhotographers.js
import React, { useEffect, useState } from "react";
import { getAllPhotographers, updatePhotographerStatus } from "../../services/api";

const ManagePhotographers = ({ token }) => {
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Manage Photographers
        </h2>
     
      </div>
    </div>
  );
};

export default ManagePhotographers;
