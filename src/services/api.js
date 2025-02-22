import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// User APIs http://localhost:5000/
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return { token: response.data.token, user: response.data.user };
  } catch (error) {
    throw error.response.data;
  }
};

 

export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched User Data:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error Fetching User:", error.response?.data || error);
    throw error.response.data;
  }
};


export const updateUserProfile = async (userData, token) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserCompletedBookingHistory = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return { error: "User not authenticated" };
    }

    const response = await axios.get("http://localhost:5000/api/users/history?status=Completed", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching completed booking history:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Failed to fetch completed booking history" };
  }
};

export const getUserBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const bookSession = async (sessionData, token) => {
  try {
    console.log("Booking session with token:", token);
    const response = await axios.post(`${API_URL}/users/book-session`, sessionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error booking session:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to book session' };
  }
};

// Fetch All Available Photographers
export const getAllPhotographers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/photographers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Photographer APIs
export const registerPhotographer = async (photographerData) => {
  try {
    const response = await axios.post(`${API_URL}/photographers/register`, photographerData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginPhotographer = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/photographers/login`, credentials);
    return { token: response.data.token, photographer: response.data.photographer };
  } catch (error) {
    throw error.response.data;
  }
};

export const getPhotographerProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/photographers/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updatePhotographerProfile = async (photographerData, token) => {
  try {
    const response = await axios.put(`${API_URL}/photographers/profile`, photographerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadPortfolio = async (portfolioData, token) => {
  try {
    const response = await axios.post(`${API_URL}/photographers/portfolio`, portfolioData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllPortfolios = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/photographers/portfolio`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updatePortfolio = async (portfolioId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/photographers/portfolio`, { portfolioId, ...updatedData }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePortfolio = async (portfolioId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/photographers/portfolio/${portfolioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getPhotographerPortfolio = async (photographerId, token) => {
  try {
    const response = await axios.get(`${API_URL}/photographers/portfolio/${photographerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.portfolio;
  } catch (error) {
    console.error("Error fetching portfolio:", error.response?.data || error);
    return [];
  }
};
export const getPhotographerBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/photographers/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateBookingStatus = async (bookingId, newStatus) => {
  console.log("Updating Booking ID:", bookingId);
  console.log("Status being sent:", newStatus);

  try {
    const response = await fetch(`http://localhost:5000/api/photographers/booking-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ bookingId, status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Invalid status value`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

 
// Admin APIs
export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register`, adminData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// In api.js
export const getAdminProfile = async (token) => {
  const response = await fetch("/api/admin/profile", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin profile");
  }

  return await response.json();
};



export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllPhotographersAdmin = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/photographers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserStatus = async (userData, token) => {
  try {
    const response = await axios.put(`${API_URL}/admin/user-status`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const viewAnalytics = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const submitRating = async (photographerId, userId, rating, comment, bookingId, token) => {
  console.log("📸 Photographer ID received in submitRating:", photographerId);

  if (!photographerId) {
      console.error("🚨 Error: photographerId is undefined!");
      return { message: "Photographer ID is missing" };
  }

  try {
      const response = await axios.post(
          `http://localhost:5000/api/photographers/rate/${photographerId}`,
          { userId, rating, comment, bookingId },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
  } catch (error) {
      console.error("🚨 Error submitting rating: ", error.response?.data);
      throw error;
  }
};

export const getPhotographerNotifications = async (token, photographerId) => {
  try {
    if (!token || !photographerId) {
      console.error('Missing token or photographer ID');
      return [];  // Return an empty array if there's no token or photographerId
    }
    
    const response = await axios.get(`http://localhost:5000/api/photographers/${photographerId}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (error.response) {
      console.error('Error Response:', error.response);
    }
    return [];
  }
};
