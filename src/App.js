import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LandingPage from "./components/user/LandingPage";
import PhotographerLogin from "./components/photographer/PhotographerLogin";
import PhotographerRegister from "./components/photographer/PhotographerRegister";
import UserLogin from "./components/user/Login";
import UserRegister from "./components/user/Register";
import AdminLogin from "./components/admin/AdminLogin";

// User Components
import Dashboard from "./components/user/Dashboard";
import Profile from "./components/user/Profile";
import History from "./components/user/History";
import Notifications from "./components/user/Notifications";
import PhotographerDetails from "./components/photographer/PhotographerDetails";
import PhotographerList from "./components/photographer/PhotographerList";
import BookSession from "./components/user/BookSession";

// Photographer Components
import PhotographerDashboard from "./components/photographer/PhotographerDashboard";
import PhotographerProfile from "./components/photographer/PhotographerProfile";
import PhotographerBookings from "./components/photographer/PhotographerBooking";
import PhotographerPortfolio from "./components/photographer/PhotographerPortfolio";
import PhotographerNotifications from "./components/photographer/PhotographerNotifications";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import AdminNotifications from "./components/admin/AdminNotifications";
import ManagePhotographers from "./components/admin/ManagePhotographers";
import ManageUsers from "./components/admin/ManageUsers";

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [photographer, setPhotographer] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("Token expired, logging out...");
          handleLogout();
        } else {
          setToken(storedToken);
          const storedUser = localStorage.getItem("user");
          const storedPhotographer = localStorage.getItem("photographer");
          const storedAdmin = localStorage.getItem("admin");
          if (storedUser) setUser(JSON.parse(storedUser));
          if (storedPhotographer) setPhotographer(JSON.parse(storedPhotographer));
          if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setPhotographer(null);
    setAdmin(null);
    window.location.href = "/"; // Redirect to home
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* User Authentication */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin setToken={setToken} setUser={setUser} />} />

        {/* Photographer Authentication */}
        <Route path="/photographer/register" element={<PhotographerRegister />} />
        <Route path="/photographer/login" element={<PhotographerLogin setToken={setToken} setPhotographer={setPhotographer} />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin setToken={setToken} setAdmin={setAdmin} />} />

        {/* User Dashboard Routes */}
        {token && user && (
          <Route path="/dashboard/*" element={<Dashboard user={user} setToken={setToken} setUser={setUser} />}>
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="history" element={<History />} />
            <Route path="photographers" element={<PhotographerList token={token} />} />
            <Route path="photographers/:id" element={<PhotographerDetails />} />
            <Route path="book-session" element={<BookSession token={token} />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        )}

        {/* Photographer Dashboard Routes */}
        {token && photographer && (
          <Route path="/photographer-dashboard/*" element={<PhotographerDashboard photographer={photographer} setToken={setToken} setPhotographer={setPhotographer} />}>
            <Route path="profile" element={<PhotographerProfile photographer={photographer} />} />
            <Route path="bookings" element={<PhotographerBookings token={token} />} />
            <Route path="portfolio" element={<PhotographerPortfolio photographer={photographer} token={token} />} />
            <Route
  path="notifications"
  element={
    <PhotographerNotifications token={token} photographerId={photographer?._id} />
  }
/>

            {console.log("photographer id", photographer._id)}
          </Route>
        )}

        {/* Admin Dashboard Routes */}
        {token && admin && (
          <Route path="/admin-dashboard/*" element={<AdminDashboard admin={admin} setToken={setToken} setAdmin={setAdmin} />}>
            <Route path="profile" element={<AdminProfile admin={admin} />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="manage-photographers" element={<ManagePhotographers />} />
            <Route path="manage-users" element={<ManageUsers />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default App;
