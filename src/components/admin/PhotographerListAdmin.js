import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiCamera, FiMail, FiPhone, FiStar, FiUser, FiX } from 'react-icons/fi';

const PhotographerListAdmin = () => {
  const [photographers, setPhotographers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const [photographersResponse, bookingsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/photographers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/admin/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPhotographers(photographersResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (photographer) => {
    setSelectedPhotographer(photographer);
    setShowModal(true);
  };

  const handleDeletePhotographer = async (photographerId) => {
    if (!window.confirm('Are you sure you want to delete this photographer?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/delete-photographer/${photographerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotographers(photographers.filter((photographer) => photographer._id !== photographerId));
    } catch (error) {
      console.error('Error deleting photographer:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-200">Photographer List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photographers.map((photographer) => (
          <motion.div 
            key={photographer._id} 
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-5 rounded-xl shadow-lg border border-gray-600 hover:shadow-2xl transition-all transform hover:-translate-y-2"
          >
            <img
              src={photographer.profilePhoto || 'https://via.placeholder.com/150'}
              alt={photographer.name}
              className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-indigo-500"
            />
            <h2 className="text-xl font-semibold text-center text-gray-100 mt-3">{photographer.name}</h2>
            <p className="text-gray-300 text-center">{photographer.specialization.join(', ')}</p>
            <div className="flex justify-center space-x-2 mt-4">
              <button 
                onClick={() => handleViewDetails(photographer)} 
                className="bg-indigo-600 px-4 py-2 rounded-lg text-white hover:bg-indigo-700 transition-all"
              >View Details</button>
              <button 
                onClick={() => handleDeletePhotographer(photographer._id)} 
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition-all"
              >Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && selectedPhotographer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div 
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg relative text-gray-100"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">{selectedPhotographer.name}</h2>
            <div className="space-y-3">
              <p><FiMail className="inline mr-2 text-blue-400" /> {selectedPhotographer.email}</p>
              <p><FiPhone className="inline mr-2 text-green-400" /> {selectedPhotographer.phone}</p>
              <p><FiCamera className="inline mr-2 text-yellow-400" /> Specialization: <span className="text-blue-300">{selectedPhotographer.specialization.join(', ')}</span></p>
              <p><FiUser className="inline mr-2 text-purple-400" /> Experience: {selectedPhotographer.experience} years</p>
              <p><FiStar className="inline mr-2 text-orange-400" /> Average Rating: {selectedPhotographer.averageRating}</p>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-4 w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PhotographerListAdmin;