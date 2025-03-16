import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Main Content */}
                <div className="flex flex-col items-center justify-center text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#fa4c4c] mb-2">PhotoStudio</h3>
                    <p className="text-gray-400 text-sm max-w-xl mb-4">
                        Capturing your precious moments with professional excellence and creative passion.
                    </p>

                    {/* Social Media Links */}
                    <div className="flex items-center justify-center space-x-4">
                        <a href="#" className="text-gray-400 hover:text-[#fa4c4c] transition-all duration-300 
                            transform hover:scale-110">
                            <FaFacebook size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#fa4c4c] transition-all duration-300 
                            transform hover:scale-110">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#fa4c4c] transition-all duration-300 
                            transform hover:scale-110">
                            <FaInstagram size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#fa4c4c] transition-all duration-300 
                            transform hover:scale-110">
                            <FaLinkedin size={20} />
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-4">
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs">
                        <p className="text-gray-400">
                            © 2024 PhotoStudio. All rights reserved.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-[#fa4c4c] transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <span className="text-gray-600">|</span>
                            <a href="#" className="text-gray-400 hover:text-[#fa4c4c] transition-colors duration-300">
                                Terms & Conditions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 