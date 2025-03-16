import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Home/Navbar";
import About from "./components/Home/about";
import Contact from "./components/Home/contact";
import Footer from "./components/Home/footer";
import Home from "./components/Home/home";
import Service from "./components/Home/service";
import Team from "./components/Home/team";

// Import your page components
// import UserLogin from "./components/auth/UserLogin";
// import PhotographerLogin from "./components/auth/PhotographerLogin";
// import AdminLogin from "./components/auth/AdminLogin";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[100px]"> {/* Add padding-top for fixed navbar and make it grow */}
        <Routes>
          <Route path="/" element={
            <div>
              <Home />
              <About />
              <Service />
              <Team />
              <Contact />
            </div>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/user-login" element={<UserLogin />} />
          <Route path="/photographer-login" element={<PhotographerLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
