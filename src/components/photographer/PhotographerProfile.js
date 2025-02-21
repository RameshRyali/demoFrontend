// src/pages/PhotographerProfile.js
import React from 'react';

const PhotographerProfile = ({ photographer }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <p><strong>Email:</strong> {photographer.email}</p>
      <p><strong>Phone:</strong> {photographer.phone}</p>
      <p><strong>Specialization:</strong> {photographer.specialization.join(', ')}</p>
      <p><strong>Experience:</strong> {photographer.experience} years</p>
    </div>
  );
};

export default PhotographerProfile;
