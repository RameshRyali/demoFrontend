// src/components/admin/ManageUsers.js
import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "../../services/api";

const ManageUsers = ({ token }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleStatusChange = async (userId, status) => {
    try {
      await updateUserStatus(userId, status, token);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Manage Users
        </h2>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{user.name}</h3>
              <p>{user.email}</p>
              <p>Status: {user.status}</p>
              <select
                value={user.status}
                onChange={(e) => handleStatusChange(user._id, e.target.value)}
                className="mt-2 p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageUsers;
