import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import Footer from "../Home/footer";
import Navbar from "../Home/Navbar";

const Login = ({ setToken, setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      setToken(response.token);
      setUser(response.user);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Background Image with White Theme */}
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url("https://source.unsplash.com/1600x900/?photography,studio,light")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl border border-gray-300">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 text-sm mb-4">
            Login to manage your bookings & profile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              icon={<FaEnvelope className="text-gray-500" />}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={<FaLock className="text-gray-500" />}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-medium tracking-wide ${
                loading
                  ? "bg-gray-400 cursor-not-allowed animate-pulse"
                  : "bg-blue-500 hover:bg-blue-600 transition-all duration-300"
              }`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/user/register" className="text-blue-500 hover:underline">
              Sign up now
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

const InputField = ({ type, name, placeholder, value, onChange, icon }) => {
  return (
    <div className="relative">
      <span className="absolute left-4 top-3.5">{icon}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
        required
      />
    </div>
  );
};

export default Login;
