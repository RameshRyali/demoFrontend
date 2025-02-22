import React, { useState, useEffect } from "react";
import { submitRating } from "../../services/api";

const RatePhotographer = ({ photographerId, bookingId, token, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(null); // Store user ID

    useEffect(() => {
        // Extract userId from token if needed (assuming it's stored in localStorage)
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            console.error("🚨 Error: User ID is missing!");
            return;
        }

        console.log("Submitting rating with:", { photographerId, userId, rating, comment, bookingId });

        try {
            const response = await submitRating(photographerId, userId, rating, comment, bookingId, token);
            console.log("✅ Rating submitted successfully:", response);
            onClose(); // Close modal after successful submission
        } catch (error) {
            console.error("🚨 Error submitting rating:", error);
        }
    };

    return (
        <div>
            <h3>Rate Photographer</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Rating:
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Comment:
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                </label>
                <br />
                <button type="submit">Submit</button>
                <button onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default RatePhotographer;
