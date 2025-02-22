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
    setSelectedFile(e.target.files[0]);
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
    <div>
      <h2 className="text-xl font-bold mb-4">Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <input
          type="file"
          name="image"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleFileChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          value={formData.description}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : editingItem ? "Update Portfolio" : "Add to Portfolio"}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Current Portfolio</h3>
        <ul className="space-y-2">
          {portfolio.length > 0 ? (
            portfolio.map((item, index) => (
              <li key={index} className="border p-4 rounded shadow relative">
                <h4 className="font-semibold">{item.title}</h4>
                <img src={item.imageUrl} alt={item.title} className="w-full h-auto rounded mt-2" />
                <p>{item.description}</p>
                <div className="flex mt-2">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </li>
            ))
          ) : (
            <p>No portfolio items found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PhotographerPortfolio;
