import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaTrash, FaEdit, FaClipboardList, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://b12-a10-server-59nx.vercel.app';

const MyServices = () => {
    // Ensure AuthContext provides 'loading' state for better timing control
    const { user, loading: authLoading } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Helper to safely extract the user's email.
     */
    const getSafeEmail = () => {
        if (!user) return null;
        return (
            user.email ||
            user.providerData?.[0]?.email ||
            user.reloadUserInfo?.email ||
            null
        );
    };

    const fetchMyServices = async () => {
        const email = getSafeEmail();

        if (!email) {
            setServices([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Check for user existence again before getting token
            if (!user) {
                setLoading(false);
                return;
            }

            const token = await user.getIdToken();
            const response = await axios.get(
                `${API_BASE_URL}/services/my-services/${email}`, // Use the safe email
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Handle common server response formats (direct array or { data: [...] })
            const responseData = response.data;
            const servicesArray = responseData.data || responseData;

            setServices(Array.isArray(servicesArray) ? servicesArray : []);

        } catch (err) {
            console.error("Fetch My Services error:", err);
            toast.error('Failed to load your services.');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only run fetch when authentication is done loading and user object is available
        if (!authLoading) {
            fetchMyServices();
        }
    }, [user, authLoading]); // Include authLoading and user in dependency array

    const handleDelete = (serviceId) => {
        // ... (Your original handleDelete logic remains unchanged)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = await user.getIdToken();
                    const response = await axios.delete(
                        `${API_BASE_URL}/services/${serviceId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    if (response.data.success) {
                        toast.success('Service deleted successfully!');
                        setServices(services.filter(service => service._id !== serviceId));
                    }
                } catch (error) {
                    console.error("Delete Service error:", error);
                    toast.error(error.response?.data?.message || 'Failed to delete service.');
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    // Fallback if user is null after loading finishes
    if (!user) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-lg max-w-6xl mx-auto">
                <p className="text-2xl text-red-600 mb-4 font-semibold">Access Denied</p>
                <p className="text-xl text-gray-600">Please log in to view your services.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center">
                <FaClipboardList className="mr-3" /> My Services ({services.length})
            </h1>

            {services.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600 mb-4">You have not added any services yet.</p>
                    <Link
                        to="/add-service"
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Click here to add your first service.
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {service.serviceName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {service.serviceCategory}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                        ${service.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <Link
                                            to={`/edit-service/${service._id}`}
                                            className="inline-flex items-center p-2 border border-indigo-500 text-indigo-600 rounded-full hover:bg-indigo-50 transition"
                                            title="Edit Service"
                                        >
                                            <FaEdit />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="inline-flex items-center p-2 border border-red-500 text-red-600 rounded-full hover:bg-red-50 transition"
                                            title="Delete Service"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyServices;