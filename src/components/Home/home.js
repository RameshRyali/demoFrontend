import React from 'react';
import image6 from '../../assets/homepage/10001.jpg';
import image4 from '../../assets/homepage/10003.webp';
import image1 from '../../assets/homepage/10004.webp';
import image2 from '../../assets/homepage/10005.webp';
import image3 from '../../assets/homepage/10006.webp';
import image5 from '../../assets/homepage/wed.webp';

const images = [
    { src: image1, title: 'Event Night' },
    { src: image2, title: 'Party Time' },
    { src: image3, title: 'Golden Hour' },
    { src: image4, title: 'Gadgets Store' },
    { src: image5, title: 'Wedding Moments' },
    { src: image6, title: 'Night Camp' },
];

const Home = () => {
    return (
        <section id="home" className="pt-28 pb-16 bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-3xl mx-auto px-4 mb-10">
                <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white">
                    Stunning Visuals
                </h2>
                <p className="text-xl md:text-2xl font-semibold text-red-700 dark:text-red-400 mt-12">
                    Explore breathtaking images from our talented photographers, ready to capture your moments.
                </p>
            </div>
            
            <div className="max-w-8xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((img, index) => (
                        <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg group">
                            <img 
                                src={img.src} 
                                alt={img.title} 
                                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">{img.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Home;
