import React, { useState, useEffect } from 'react';
import { getAllPhotographers, getPhotographerPortfolio } from '../../services/api';
import BookSession from '../user/BookSession';
import { motion, AnimatePresence } from 'framer-motion';

const PhotographerList = ({ token }) => {
  const [photographers, setPhotographers] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleBookNow = (photographer) => {
    setSelectedPhotographer(photographer);
    setShowBookingModal(true);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📸 Available Photographers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover talented photographers and book your perfect session</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photographers.map((photographer) => (
            <motion.div 
              key={photographer._id} 
              className="group bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl border border-gray-100"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              
              <div className="relative px-6 pb-6 -mt-24">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse" />
                    <img 
                      src={photographer.profilePhoto || 'https://via.placeholder.com/150'} 
                      alt={photographer.name} 
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl relative z-10"
                    />
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold text-gray-800">{photographer.name}</h3>
                  
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {photographer.specialization.map((spec, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm font-medium text-gray-700"
                      >
                        📍 {spec}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 py-2 px-4 bg-gray-50 rounded-2xl inline-block">
                    <p className="text-gray-600">
                      <span className="font-semibold">📅 {photographer.experience}</span> Years of Experience
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => handleBookNow(photographer)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px] focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group-hover:from-blue-600 group-hover:to-indigo-700"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-lg">📅</span>
                        Book Now
                      </span>
                    </button>
                    
                    <button
                      onClick={() => handleViewPortfolio(photographer)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px] focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 group-hover:from-gray-800 group-hover:to-gray-900"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-lg">🖼️</span>
                        View Portfolio
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showBookingModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="p-8">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setShowBookingModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <BookSession token={token} photographerId={selectedPhotographer?._id} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {showPortfolioModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-7xl m-4 max-h-[90vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="p-8">
              <button
                className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
                onClick={() => setShowPortfolioModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {selectedPhotographer?.name}'s Portfolio
                </h3>
                <p className="text-gray-600 mt-2">Browse through their amazing work</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[65vh] p-4 custom-scrollbar">
                {portfolio.length > 0 ? (
                  portfolio.map((image, index) => (
                    <motion.div 
                      key={index} 
                      className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(image.imageUrl)}
                    >
                      <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.title || "Portfolio Image"}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                          <h4 className="text-lg font-semibold text-gray-800 mb-1">{image.title || "Untitled"}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{image.description || "No description available"}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-xl text-gray-500">No portfolio images available yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/95 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.img 
                src={selectedImage} 
                alt="Selected" 
                className="rounded-2xl shadow-2xl max-w-full max-h-[90vh] object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PhotographerList;
