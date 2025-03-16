import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/homepage/logo1.jpg";

const Navbar = () => {
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLoginDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            window.location.href = `/#${sectionId}`;
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleLoginDropdown = () => {
        setShowLoginDropdown(!showLoginDropdown);
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-24">
                {/* Logo Section */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center">
                        <img src={Logo} alt="Logo" className="h-16 w-auto object-contain" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-extrabold text-gray-900 tracking-wide">
                            CLICK YOUR MOMENTS
                        </h1>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-10">
                    {["home", "about", "services", "contact"].map((section) => (
                        <button
                            key={section}
                            onClick={() => scrollToSection(section)}
                            className="text-gray-700 hover:text-red-500 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}

                    {/* Login Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleLoginDropdown}
                            className="px-8 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg 
                                hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Login
                        </button>

                        {showLoginDropdown && (
                            <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg 
                                border border-gray-200 py-2 z-50">
                                {[
                                    { label: "User Login", path: "/user/login" },
                                    { label: "Photographer Login", path: "/photographer/login" },
                                    { label: "Admin Login", path: "/admin/login" },
                                ].map(({ label, path }) => (
                                    <Link
                                        key={label}
                                        to={path}
                                        className="block px-5 py-3 text-lg text-gray-700 font-medium
                                            hover:bg-gray-100 hover:text-red-500 transition-all duration-300"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
