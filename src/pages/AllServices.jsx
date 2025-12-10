import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ServiceCard from '../components/ServiceCard';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://b12-a10-server-59nx.vercel.app';

const SERVICES_PER_PAGE = 9;

const AllServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalServices, setTotalServices] = useState(0);

    const totalPages = Math.ceil(totalServices / SERVICES_PER_PAGE);

    const fetchServices = (page, search) => {
        setLoading(true);
        const url = `${API_BASE_URL}/services/all?page=${page}&limit=${SERVICES_PER_PAGE}&search=${search}`;

        axios.get(url)
            .then(res => {
                setServices(res.data.services);
                setTotalServices(res.data.totalCount);
            })
            .catch(err => {
                console.error("Error fetching services:", err);
                toast.error('Failed to load services.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchServices(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchQuery);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800">
                All Available Services
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex">
                <input
                    type="text"
                    placeholder="Search by Service Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition duration-200"
                >
                    <FaSearch />
                </button>
            </form>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {/* Service Grid */}
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map(service => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-xl text-red-600">
                            No services found matching your criteria.
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalServices > SERVICES_PER_PAGE && (
                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition"
                            >
                                <FaChevronLeft />
                            </button>

                            <span className="text-lg font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllServices;