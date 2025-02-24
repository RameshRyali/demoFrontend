import React, { useState, useEffect } from "react";
import { submitRating } from "../../services/api";
import { FaStar } from "react-icons/fa";

const RatePhotographer = ({ photographerId, bookingId, token, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.id) setUserId(storedUser.id);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return console.error("🚨 Error: User ID is missing!");

        try {
            await submitRating(photographerId, userId, rating, comment, bookingId, token);
            onClose();
        } catch (error) {
            console.error("🚨 Error submitting rating:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center border border-gray-300">
                <h3 className="text-lg font-bold text-gray-800">Customer Review</h3>
                <div className="flex justify-center gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`cursor-pointer text-xl transition ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <h4 className="text-md font-semibold text-gray-700">Amazing Photographer</h4>
                <p className="text-xs text-gray-600 italic mb-2">"Capture the best moments with our professional photographers."</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        className="w-full p-2 border rounded-md bg-gray-100 text-gray-700 focus:ring focus:ring-yellow-300"
                        placeholder="Write your review..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md font-semibold transition"
                    >
                        Submit Review
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-md transition"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RatePhotographer;
