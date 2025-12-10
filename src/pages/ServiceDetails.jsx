import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUserCircle, FaDollarSign, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthProvider';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://b12-a10-server-59nx.vercel.app';

const ServiceDetails = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/services/${id}`)
            .then(res => {
                setService(res.data);
            })
            .catch(err => {
                console.error("Error fetching service details:", err);
                toast.error('Failed to load service details.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!service) {
        return <div className="text-center py-20 text-xl font-semibold text-red-600">Service not found!</div>;
    }

    const isProvider = user && user.email === service.providerEmail;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

                {/* Image and Primary Info */}
                <div className="relative">
                    <img
                        src={service.serviceImage}
                        alt={service.serviceName}
                        className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-8">
                        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
                            {service.serviceName}
                        </h1>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-8">
                    {/* Service Description and Details */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold text-indigo-700 border-b pb-2">Service Overview</h2>
                        <p className="text-gray-700 leading-relaxed">{service.serviceDescription}</p>

                        <div className="flex items-center space-x-4 text-2xl font-semibold text-green-600">

                            <p>Price BDT: {service.price}</p>
                        </div>

                        <div className="text-lg text-gray-600 flex items-center space-x-3">
                            <FaCalendarAlt className="text-indigo-500" />
                            <span>Area: {service.serviceArea}</span>
                        </div>

                        <div className="text-lg text-gray-600">
                            <span className="font-semibold">Category:</span> {service.serviceCategory}
                        </div>
                    </div>

                    {/* Provider Information */}
                    <div className="md:col-span-1 bg-indigo-50 p-6 rounded-lg shadow-inner space-y-4">
                        <h2 className="text-2xl font-bold text-indigo-700 flex items-center border-b pb-2 mb-4">
                            <FaUserCircle className="mr-2" />
                            Provider Details
                        </h2>

                        <div className="flex items-center space-x-4">
                            <img
                                src={service.providerImage || 'https://via.placeholder.com/64'}
                                alt={service.providerName}
                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <div>
                                <p className="text-xl font-semibold text-gray-800">{service.providerName}</p>
                                <p className="text-sm text-gray-600">{service.providerEmail}</p>
                            </div>
                        </div>

                        {/* Booking Button Section */}
                        <div className="pt-4">
                            {!user ? (
                                <button
                                    onClick={() => toast.error('Please login to book this service')}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
                                >
                                    Book Now
                                </button>
                            ) : isProvider ? (
                                <button
                                    disabled
                                    title="You cannot book your own service."
                                    className="w-full px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg flex items-center justify-center cursor-not-allowed"
                                >
                                    <FaInfoCircle className="mr-2" /> You are the provider
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
                                >
                                    Book Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {service && user && !isProvider && (
                <BookingModal
                    service={service}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />
            )}
        </div>
    );
};

export default ServiceDetails;