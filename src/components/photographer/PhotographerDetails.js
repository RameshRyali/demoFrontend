// src/pages/PhotographerDetails.js
import React from 'react';
import { FaCamera, FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const PhotographerDetails = ({ photographers }) => {
  const { id } = useParams();
  const photographer = photographers.find((p) => p._id === id);

  if (!photographer) {
    return <div>Photographer not found</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{photographer.name}</h2>
      <p><strong>Specialization:</strong> {photographer.specialization.join(', ')}</p>
      <p><strong>Experience:</strong> {photographer.experience} years</p>
      <p><strong>Rating:</strong> {photographer.rating} <FaStar className="inline text-yellow-500" /></p>
      <div>
        <h3 className="font-semibold mt-4">Portfolio</h3>
        <ul className="space-y-2">
          {photographer.portfolio.map((item, index) => (
            <li key={index} className="flex items-center">
              <FaCamera className="mr-2" />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhotographerDetails;
