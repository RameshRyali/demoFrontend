// src/routes/UserDashboardRoutes.js
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import BookSession from "../user/BookSession";
import Dashboard from "../user/Dashboard";
import History from "../user/History";
import Notifications from "../user/Notifications";
import PhotographerDetails from "../photographer/PhotographerDetails";
import PhotographerList from "../photographer/PhotographerList";
import Profile from "../user/Profile";

const UserDashboardRoutes = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("Stored Token:", storedToken);
    console.log("Stored User:", storedUser);

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect to login if token is missing
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<Dashboard user={user} setToken={setToken} setUser={setUser} />}
      >
        <Route path="profile" element={<Profile user={user} />} />
        <Route path="history" element={<History />} />
        <Route path="photographers" element={<PhotographerList token={token} />} />
        <Route path="photographers/:id" element={<PhotographerDetails />} />
        <Route path="book-session" element={<BookSession token={token} />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default UserDashboardRoutes;
