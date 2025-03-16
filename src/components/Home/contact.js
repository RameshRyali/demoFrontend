import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        message: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/users/contact', formData);
            setSuccessMessage(response.data.message);
            setFormData({ firstname: '', lastname: '', email: '', phonenumber: '', message: '' });
        } catch (error) {
            setErrorMessage('Failed to submit the form. Please try again later.');
        }
    };

    return (
        <section id="contact" className="py-40 bg-gradient-to-b from-white to-gray-100">
            <div className="max-w-full mx-auto px-12">
                <div className="text-center mb-24">
                    <h2 className="text-6xl font-extrabold text-gray-900 mb-8">Contact Us</h2>
                    <div className="w-40 h-3 bg-red-500 mx-auto mb-8 rounded-full"></div>
                    <p className="text-xl md:text-2xl font-semibold text-red-700 dark:text-red-400 mt-12">
                        Have questions or need assistance? Reach out to us anytime, and we’ll be happy to help!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    <div className="bg-red-500 rounded-3xl p-16 text-white shadow-2xl">
                        <h3 className="text-4xl font-semibold mb-10">Contact Information</h3>
                        <div className="space-y-10">
                            <div className="flex items-start space-x-8">
                                <FaMapMarkerAlt className="w-10 h-10 mt-1" />
                                <p className="text-xl opacity-90 leading-relaxed">4-19 Vinayaka Street,<br />Narsapur,west godavari, 534210</p>
                            </div>
                            <div className="flex items-center space-x-8">
                                <FaEnvelope className="w-10 h-10" />
                                <p className="text-xl opacity-90">photographerbooking@gmail.com</p>
                            </div>
                            <div className="flex items-center space-x-8">
                                <FaPhone className="w-10 h-10" />
                                <p className="text-xl opacity-90">+91 79955550889</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-16">
                        <h3 className="text-4xl font-semibold text-gray-900 mb-10">Send a Message</h3>

                        {successMessage && <p className="text-green-500 text-xl mb-4">{successMessage}</p>}
                        {errorMessage && <p className="text-red-500 text-xl mb-4">{errorMessage}</p>}

                        <form className="space-y-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} 
                                    className="w-full px-8 py-6 bg-gray-50 rounded-xl border border-gray-300 text-2xl focus:outline-none focus:border-red-500 transition-all"
                                    placeholder="First Name" required />
                                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} 
                                    className="w-full px-8 py-6 bg-gray-50 rounded-xl border border-gray-300 text-2xl focus:outline-none focus:border-red-500 transition-all"
                                    placeholder="Last Name" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} 
                                    className="w-full px-8 py-6 bg-gray-50 rounded-xl border border-gray-300 text-2xl focus:outline-none focus:border-red-500 transition-all"
                                    placeholder="Email Address" required />
                                <input type="tel" name="phonenumber" value={formData.phonenumber} onChange={handleChange} 
                                    className="w-full px-8 py-6 bg-gray-50 rounded-xl border border-gray-300 text-2xl focus:outline-none focus:border-red-500 transition-all"
                                    placeholder="Phone Number" required />
                            </div>

                            <textarea name="message" value={formData.message} onChange={handleChange}
                                className="w-full px-8 py-6 bg-gray-50 rounded-xl border border-gray-300 text-2xl focus:outline-none focus:border-red-500 transition-all h-64"
                                placeholder="Write your message here..." required></textarea>

                            <button type="submit"
                                className="w-full md:w-auto px-10 py-5 bg-red-500 text-white rounded-xl text-2xl hover:bg-red-600 transition-all shadow-md">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
