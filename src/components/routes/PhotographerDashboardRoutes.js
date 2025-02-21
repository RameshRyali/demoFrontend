// src/routes/PhotographerDashboardRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import PhotographerBookings from "../photographer/PhotographerBooking";
import PhotographerDashboard from "../photographer/PhotographerDashboard";
import PhotographerNotifications from "../photographer/PhotographerNotifications";
import PhotographerPortfolio from "../photographer/PhotographerPortfolio";
import PhotographerProfile from "../photographer/PhotographerProfile";

const PhotographerDashboardRoutes = ({ photographer, token, setToken, setPhotographer }) => {
  return (
    <Routes>
      <Route path="/photographer" element={<PhotographerDashboard photographer={photographer} setToken={setToken} setPhotographer={setPhotographer} />}>
        <Route path="profile" element={<PhotographerProfile photographer={photographer} />} />
        <Route path="bookings" element={<PhotographerBookings token={token} />} />
        <Route path="portfolio" element={<PhotographerPortfolio photographer={photographer} token={token} />} />
        <Route path="notifications" element={<PhotographerNotifications />} />
      </Route>
    </Routes>
  );
};

export default PhotographerDashboardRoutes;
