import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminLogin from "./components/admin/AdminLogin";
import PhotographerLogin from "./components/photographer/PhotographerLogin";
import PhotographerRegister from "./components/photographer/PhotographerRegister";
import UserLogin from "./components/user/Login";
import UserRegister from "./components/user/Register";

// User Components
import PhotographerDetails from "./components/photographer/PhotographerDetails";
import PhotographerList from "./components/photographer/PhotographerList";
import BookSession from "./components/user/BookSession";
import Dashboard from "./components/user/Dashboard";
import History from "./components/user/History";
import Notifications from "./components/user/Notifications";
import Profile from "./components/user/Profile";

// Photographer Components
import PhotographerBookings from "./components/photographer/PhotographerBooking";
import PhotographerDashboard from "./components/photographer/PhotographerDashboard";
import PhotographerNotifications from "./components/photographer/PhotographerNotifications";
import PhotographerPortfolio from "./components/photographer/PhotographerPortfolio";
import PhotographerProfile from "./components/photographer/PhotographerProfile";

// Admin Components
import AddPhotographer from "./components/admin/AddPhotographer";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminNotifications from "./components/admin/AdminNotifications";
import Analytics from "./components/admin/Analytics";
import PhotographerListAdmin from "./components/admin/PhotographerListAdmin";
import Sidebar from "./components/admin/Sidebar";
import LandingPage from "./LandingPage";
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
            <Route path="notifications" element={<PhotographerNotifications token={token} photographerId={photographer?._id} />}
          />
            {console.log("photographer id", photographer._id)}
          </Route>
        )}

        {/* Admin Dashboard Routes */}
        {token && admin && (
          <Route path="/Sidebar/*" element={<Sidebar admin={admin} setToken={setToken} setAdmin={setAdmin} />}>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="add-photographer" element={<AddPhotographer />} />
            <Route path="photographer-list" element={<PhotographerListAdmin />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default App;
