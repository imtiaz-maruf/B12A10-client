import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const slidesData = [
    {
        id: 1,
        headline: "Instant Fixes, Local Heroes.",
        details: "Book certified plumbers, electricians, and handymen near you, fast.",
        image: "/2.jpg",
        buttonText: "Find a Plumber"
    },
    {
        id: 2,
        headline: "Sparkling Clean Guaranteed.",
        details: "Top-rated cleaning services tailored to your schedule and budget.",
        image: "/1.jpg",
        buttonText: "Book Cleaning"
    },

];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slidesData.length) % slidesData.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
    };

    const currentSlide = slidesData[currentIndex];

    return (
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-xl shadow-2xl">
            {slidesData.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <img
                        src={slide.image}
                        alt={slide.headline}
                        className="w-full h-full object-cover brightness-50"
                    />

                    {/* Content */}
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                            {slide.headline}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md">
                            {slide.details}
                        </p>
                        <Link
                            to="/services"
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg text-lg hover:bg-indigo-700 transition duration-200"
                        >
                            {slide.buttonText}
                        </Link>
                    </motion.div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 z-20"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 z-20"
            >
                <FaChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slidesData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-indigo-500' : 'bg-white opacity-50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;