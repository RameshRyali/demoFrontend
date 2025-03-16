import React, { useState, useEffect } from 'react';
import { uploadPortfolio, updatePortfolio, deletePortfolio, getAllPortfolios } from '../../services/api';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpectnvk/image/upload";
const UPLOAD_PRESET = "mediafiles";

const PhotographerPortfolio = ({ photographer, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 🔹 Fetch portfolio items on component mount
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await getAllPortfolios(token);
        setPortfolio(response.portfolio); // Ensure this matches the response structure
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchPortfolio();
  }, [token]); // Runs only when token changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let uploadedImageUrl = formData.imageUrl;

    if (selectedFile) {
      try {
        const formDataCloud = new FormData();
        formDataCloud.append("file", selectedFile);
        formDataCloud.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formDataCloud,
        });

        const data = await response.json();
        uploadedImageUrl = data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Image upload failed.");
        setUploading(false);
        return;
      }
    }

    try {
      let updatedPortfolio;
      if (editingItem) {
        updatedPortfolio = await updatePortfolio(editingItem._id, { ...formData, imageUrl: uploadedImageUrl }, token);
        setPortfolio(portfolio.map(item => item._id === editingItem._id ? updatedPortfolio : item));
      } else {
        const newPortfolioItem = await uploadPortfolio({ ...formData, imageUrl: uploadedImageUrl, photographerId: photographer._id }, token);
        setPortfolio([...portfolio, newPortfolioItem]);
      }
      setFormData({ title: '', description: '', imageUrl: '' });
      setSelectedFile(null);
      setEditingItem(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ title: item.title, description: item.description, imageUrl: item.imageUrl });
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio item?")) {
      try {
        await deletePortfolio(id, token);
        setPortfolio(portfolio.filter(item => item._id !== id));
      } catch (error) {
        alert("Failed to delete portfolio item.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Portfolio Management</h2>
      
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onChange={handleChange}
                  value={formData.title}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onChange={handleChange}
                  value={formData.description}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    className="hidden"
                    id="portfolio-image"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="portfolio-image"
                    className="cursor-pointer flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-all duration-200"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <span>{editingItem ? 'Update Portfolio' : 'Add to Portfolio'}</span>
            )}
          </button>
        </form>
      </div>

      {/* Portfolio Grid */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Portfolio Gallery</h3>
        {portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-w-16 aspect-h-12">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No portfolio items found. Add your first item above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotographerPortfolio;
