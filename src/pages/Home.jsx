import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';
import ServiceCard from '../components/ServiceCard';
import { FaShieldAlt, FaRocket, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://b12-a10-server-59nx.vercel.app';

const Home = () => {
    const [topServices, setTopServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/services/top-rated`)
            .then(res => {
                setTopServices(res.data);
            })
            .catch(err => {
                console.error("Error fetching top services:", err);
                toast.error('Failed to load top services.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const WhyChooseUs = () => (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="py-16 bg-gray-50"
        >
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
                Why Choose Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <FaShieldAlt className="text-5xl text-indigo-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">Trusted Professionals</h4>
                    <p className="text-gray-600">
                        All our providers are vetted and background-checked for your peace of mind.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <FaRocket className="text-5xl text-indigo-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">Fast & Easy Booking</h4>
                    <p className="text-gray-600">
                        Book a service in three simple clicks and get instant confirmation.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <FaHandshake className="text-5xl text-indigo-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">Transparent Pricing</h4>
                    <p className="text-gray-600">
                        No hidden fees. You see the full price before confirming your appointment.
                    </p>
                </div>
            </div>
        </motion.section>
    );

    const Testimonials = () => (
        <section className="py-16">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
                Hear From Our Customers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-indigo-50 rounded-xl shadow-md border border-indigo-200"
                >
                    <p className="text-lg italic text-gray-700 mb-4">
                        "The electrician was prompt, professional, and fixed my issue instantly. Highly recommended!"
                    </p>
                    <div className="font-semibold text-indigo-700">— Asif Uddin Ahmed</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="p-6 bg-indigo-50 rounded-xl shadow-md border border-indigo-200"
                >
                    <p className="text-lg italic text-gray-700 mb-4">
                        "Booking a cleaner has never been easier. My house looks fantastic!"
                    </p>
                    <div className="font-semibold text-indigo-700">— Naquibul Islam</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="p-6 bg-indigo-50 rounded-xl shadow-md border border-indigo-200"
                >
                    <p className="text-lg italic text-gray-700 mb-4">
                        "Excellent service quality and great value for money. HomeHero is my new go-to."
                    </p>
                    <div className="font-semibold text-indigo-700">— Aftab Uddin</div>
                </motion.div>
            </div>
        </section>
    );

    return (
        <div className="space-y-16">
            {/* Hero Section: Slider */}
            <HeroSlider />

            {/* Dynamic Section: Top-Rated Services */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Our Top Rated Services
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {topServices.map(service => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                to="/services"
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg text-lg hover:bg-indigo-700 transition duration-200"
                            >
                                Explore All Services
                            </Link>
                        </div>
                    </>
                )}
            </motion.section>

            <hr className="border-gray-200" />

            {/* Static Section 1: Why Choose Us */}
            <WhyChooseUs />

            <hr className="border-gray-200" />

            {/* Static Section 2: Customer Testimonials */}
            <Testimonials />
        </div>
    );
};

export default Home;