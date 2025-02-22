import React, { useState, useEffect } from 'react';
import { getAllPhotographers, getPhotographerPortfolio } from '../../services/api';
import BookSession from '../user/BookSession';

const PhotographerList = ({ token }) => {
  const [photographers, setPhotographers] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const data = await getAllPhotographers(token);
        setPhotographers(data);
      } catch (error) {
        console.error('Error fetching photographers:', error);
      }
    };

    fetchPhotographers();
  }, [token]);

  // Handle Booking
  const handleBookNow = (photographer) => {
    setSelectedPhotographer(photographer);
    setShowBookingModal(true);
  };

  // Handle Viewing Portfolio
  const handleViewPortfolio = async (photographer) => {
    try {
      const portfolioData = await getPhotographerPortfolio(photographer._id, token);
      setPortfolio(portfolioData || []);
      setSelectedPhotographer(photographer);
      setShowPortfolioModal(true);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setPortfolio([]);
    }
  };

  // Function to Render Star Ratings (★)
  const renderStars = (rating) => {
    const totalStars = 5;
    let filledStars = Math.floor(rating);  // Filled stars
    let halfStar = rating % 1 >= 0.5 ? 1 : 0; // Handle half-star
    let emptyStars = totalStars - filledStars - halfStar;  // Empty stars

    const stars = (
      <>
        {"★".repeat(filledStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );

    return <span className="text-yellow-500 text-lg">{stars}</span>;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📸 Available Photographers</h2>
      <ul className="space-y-6">
        {photographers.map((photographer) => (
          <li key={photographer._id} className="border p-4 rounded-lg shadow-md flex items-center gap-4 bg-white">
            {/* Profile Photo */}
            <img 
              src={photographer.profilePhoto || 'https://via.placeholder.com/100'} 
              alt={photographer.name} 
              className="w-20 h-20 rounded-full object-cover border-2"
            />

            {/* Photographer Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {photographer.name} 
                <span>{renderStars(photographer.rating || 0)}</span> {/* Rating displayed here */}
                <span className="text-gray-500 text-sm">({photographer.rating}4.5/5)</span>
              </h3>
              <p className="text-gray-700">📍 {photographer.specialization.join(', ')}</p>
              <p className="text-gray-600">📅 Experience: {photographer.experience} Years</p>
            </div>

            {/* Buttons */}
            <div className="space-x-3">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                onClick={() => handleBookNow(photographer)}
              >
                📅 Book Now
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
                onClick={() => handleViewPortfolio(photographer)}
              >
                🖼️ View Portfolio
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 bg-white p-2 rounded-full shadow-md"
              onClick={() => setShowBookingModal(false)}
            >
              &times;
            </button>
            <BookSession token={token} photographerId={selectedPhotographer?._id} />
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 bg-white p-2 rounded-full shadow-md"
              onClick={() => setShowPortfolioModal(false)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-4">
              {selectedPhotographer?.name}'s Portfolio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolio.length > 0 ? (
                portfolio.map((image, index) => (
                  <div key={index} className="border rounded-lg p-3 shadow-md bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={image.title || "Portfolio Image"}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h4 className="text-lg font-semibold mt-2">{image.title || "Untitled"}</h4>
                    <p className="text-sm text-gray-600">{image.description || "No description available"}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No portfolio images available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotographerList;
