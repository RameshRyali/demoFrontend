// src/pages/PhotographerPortfolio.js
import React, { useState } from 'react';
import { uploadPortfolio } from '../../services/api';

const PhotographerPortfolio = ({ photographer, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadPortfolio({ ...formData, photographerId: photographer._id }, token);
      alert('Portfolio uploaded successfully');
      // Optionally, update the portfolio state or refetch data
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Add to Portfolio
        </button>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Current Portfolio</h3>
        <ul className="space-y-2">
          {photographer.portfolio.map((item, index) => (
            <li key={index} className="border p-4 rounded shadow">
              <h4 className="font-semibold">{item.title}</h4>
              <img src={item.imageUrl} alt={item.title} className="w-full h-auto rounded mt-2" />
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhotographerPortfolio;
