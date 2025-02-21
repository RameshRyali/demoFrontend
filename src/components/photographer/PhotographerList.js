// src/pages/PhotographerList.js
import React, { useState, useEffect } from 'react';
import { getAllPhotographers } from '../../services/api';
import BookSession from '../user/BookSession'; // Import the BookSession component

const PhotographerList = ({ token }) => {
  const [photographers, setPhotographers] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    console.log('Token received in PhotographerList:', token);
    const fetchPhotographers = async () => {
      try {
        const data = await getAllPhotographers(token);
        setPhotographers(data);
        console.log('Fetched photographers:', data);
      } catch (error) {
        console.error('Error fetching photographers:', error);
      }
    };

    fetchPhotographers();
  }, [token]);

  const handleBookNow = (photographer) => {
    console.log('Booking photographer:', photographer);
    setSelectedPhotographer(photographer);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedPhotographer(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Photographers</h2>
      <ul className="space-y-4">
        {photographers.map((photographer) => (
          <li key={photographer._id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{photographer.name}</h3>
            <p>{photographer.specialization.join(', ')}</p>
            <p>Experience: {photographer.experience} years</p>
            <button
              className="mt-2 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-all duration-300"
              onClick={() => handleBookNow(photographer)}
            >
              Book Now
            </button>
          </li>
        ))}
      </ul>
      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 bg-white p-2 rounded-full shadow-md"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <BookSession token={token} photographerId={selectedPhotographer ? selectedPhotographer._id : null} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotographerList;
