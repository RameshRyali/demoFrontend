import { motion } from "framer-motion";
import React from "react";
import { FaCamera, FaGlobe, FaUsers } from 'react-icons/fa';

const features = [
    { id: 1, title: "Explore", icon: <FaGlobe className="h-full w-full text-white" />, description: "Browse through our diverse pool of talented photographers, each with their unique style and expertise.", gradient: "from-purple-500 to-red-500" },
    { id: 2, title: "Professional Service", icon: <FaCamera className="h-full w-full text-white" />, description: "Experience top-notch photography services with our professionally trained and experienced photographers.", gradient: "from-blue-500 to-indigo-500" },
    { id: 3, title: "Growing Community", icon: <FaUsers className="h-full w-full text-white" />, description: "Join our thriving community of photography enthusiasts and professionals sharing their passion.", gradient: "from-green-500 to-teal-500" }
];

const About = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="about">
            <div className="max-w-[90rem] mx-auto px-8">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-center mb-20"
                >
                    <h2 className="text-6xl font-extrabold text-gray-900 mb-6">
                        About Us
                    </h2>
                    <div className="w-24 h-2 bg-red-500 mx-auto mb-8"></div>
                    <p className="text-xl md:text-2xl font-semibold text-red-700 dark:text-red-400 mt-12">
                        Our mission is to enable people to preserve their precious memories in true-to-life quality.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
                    {features.map((feature) => (
                        <motion.div 
                            key={feature.id} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 0.5, delay: feature.id * 0.2 }}
                            className="group bg-white py-14 px-12 min-h-[370px] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
                        >
                            <div className="mb-10">
                                <div className={`h-28 w-28 bg-gradient-to-r ${feature.gradient} rounded-xl p-7 transition-all duration-300 group-hover:scale-110`}>
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-red-500 transition-all duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-loose text-xl">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
