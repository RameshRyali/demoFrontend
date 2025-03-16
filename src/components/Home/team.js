import { motion } from "framer-motion";
import React from "react";
import team1 from '../../assets/talentedphotographers/mem1.jpg';
import team2 from '../../assets/talentedphotographers/mem2.jpg';
import team3 from '../../assets/talentedphotographers/mem3.jpg';

const teamMembers = [
    { img: team1, name: "Emily Johnson", role: "Wedding Photographer", desc: "Emily captures the magic of your special day with a keen eye for detail." },
    { img: team2, name: "Michael Smith", role: "Event Photographer", desc: "Michael excels in capturing the essence of events with stunning imagery." },
    { img: team3, name: "Sophia Lee", role: "Indoor Photographer", desc: "Sophia specializes in capturing beautiful and candid portraits." }
];

const Team = () => {
    return (
        <section id="team" className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-full mx-auto px-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-center mb-20"
                >
                    <h2 className="text-6xl font-extrabold text-gray-900 mb-6">
                        Our Talented Team
                    </h2>
                    <div className="w-24 h-2 bg-red-500 mx-auto mb-8"></div>
                    <p className="text-2xl font-medium text-red-700 dark:text-red-400">
                        Meet our expert photographers, each specializing in different fields to make your moments unforgettable.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {teamMembers.map((member, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl 
                                       transition-transform duration-300 transform hover:-translate-y-2 border border-gray-200"
                        >
                            <div className="relative w-full h-96 overflow-hidden">
                                <img 
                                    src={member.img} 
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 
                                               group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 
                                               group-hover:bg-opacity-20 transition-all duration-500"></div>
                            </div>
                            <div className="p-10 text-center">
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-red-500 text-xl font-semibold mb-4">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {member.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
