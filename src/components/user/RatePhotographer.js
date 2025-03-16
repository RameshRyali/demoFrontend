import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { submitRating } from "../../services/api";

const RatePhotographer = memo(({ photographerId, bookingId, token, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.id) setUserId(storedUser.id);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || isSubmitting) return console.error("🚨 Error: User ID is missing or already submitting!");

        setIsSubmitting(true);
        try {
            await submitRating(photographerId, userId, rating, comment, bookingId, token);
            onClose();
        } catch (error) {
            console.error("🚨 Error submitting rating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {onClose && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-600 relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                            <span className="sr-only">Close</span>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 className="text-2xl font-bold text-center mb-4">Rate Your Experience</h3>
                        <p className="text-gray-300 text-center mb-6">Your feedback helps our community grow!</p>
                        
                        <div className="flex justify-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`cursor-pointer text-3xl transition ${i < rating ? "text-yellow-500" : "text-gray-500"}`}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                className="w-full p-3 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-yellow-500"
                                placeholder="Write your review..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default RatePhotographer;
