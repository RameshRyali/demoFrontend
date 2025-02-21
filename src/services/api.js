import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// User APIs
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
    return response.data;
  } catch (error) {
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

export const getPhotographerNotifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/photographers/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
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
