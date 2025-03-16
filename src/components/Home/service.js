import { motion } from "framer-motion";
import React from "react";
import Event from '../../assets/services/event.jpg';
import Indoor from '../../assets/services/indoor.jpg';
import Outdoor from '../../assets/services/outdoor1.jpg';

const services = [
    { id: 1, title: "Event Photographers", image: Event, description: "Our event photographers capture every important moment, ensuring that your memories are preserved in high-quality images." },
    { id: 2, title: "Outdoor Photographers", image: Outdoor, description: "Our outdoor photographers are skilled in capturing the beauty of nature and outdoor events in a stunning way." },
    { id: 3, title: "Indoor Photographers", image: Indoor, description: "Indoor photography that brings out the best lighting and angles for your indoor events or portraits." }
];

const Service = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="services">
            <div className="max-w-[95rem] mx-auto px-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Our Services
                    </h2>
                    <div className="w-20 h-1.5 bg-red-500 mx-auto mb-6"></div>
                    <p className="text-xl md:text-2xl font-semibold text-red-700 dark:text-red-400 mt-12">
                        Our photographers are available to capture your moments whenever and wherever you need, offering flexible
                        scheduling to fit seamlessly into your plans.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service) => (
                        <motion.div 
                            key={service.id} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 0.5, delay: service.id * 0.2 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                        >
                            <div className="relative w-full h-72 md:h-80 lg:h-96 overflow-hidden">
                                <img src={service.image} alt={service.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500"></div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-extrabold mb-3 text-gray-900">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Service;
