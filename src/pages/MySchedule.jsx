import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaCalendarCheck, FaSpinner, FaCheckCircle, FaHourglassHalf, FaPlay, FaUser, FaDollarSign } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://b12-a10-server-59nx.vercel.app';

const MySchedule = () => {
    // Assuming AuthContext provides 'loading' state as authLoading
    const { user, loading: authLoading } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
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

    const fetchMySchedule = async () => {
        const email = getSafeEmail(); // Use the safe extraction helper

        if (!email) {
            setBookings([]);
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
                `${API_BASE_URL}/bookings/my-schedule/${email}`, // Use the safely extracted email
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // FIX: Ensure you handle various server response formats (e.g., direct array or { data: [...] })
            const bookingsData = response.data.data || response.data;
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);

        } catch (err) {
            console.error("Fetch My Schedule error:", err);
            console.error("Error response:", err.response?.data);
            toast.error(err.response?.data?.message || 'Failed to load your schedule.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * FIX: Only run fetch when authentication is done loading and the user object is available.
     */
    useEffect(() => {
        if (!authLoading && user) {
            fetchMySchedule();
        } else if (!authLoading && !user) {
            // If auth is done loading and there is no user, stop the loading spinner
            setLoading(false);
        }
    }, [user, authLoading]); // Depend on user and authLoading for proper timing

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const token = await user.getIdToken();
            const response = await axios.patch(
                `${API_BASE_URL}/bookings/${bookingId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success && response.data.modifiedCount === 1) {
                toast.success(`Booking status updated to ${newStatus}`);
                setBookings(bookings.map(booking =>
                    booking._id === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                ));
            }
        } catch (error) {
            console.error("Update Booking Status error:", error);
            toast.error(error.response?.data?.message || 'Failed to update status.');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getNextStatus = (currentStatus) => {
        if (currentStatus === 'Pending') return 'In Progress';
        if (currentStatus === 'In Progress') return 'Completed';
        return null;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <FaHourglassHalf />;
            case 'In Progress':
                return <FaPlay />;
            case 'Completed':
                return <FaCheckCircle />;
            default:
                return null;
        }
    };

    if (loading || authLoading) { // Check both component loading and auth loading
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    // Fallback if user is null after loading finishes
    if (!user) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-lg max-w-7xl mx-auto">
                <p className="text-2xl text-red-600 mb-4 font-semibold">Authentication Required</p>
                <p className="text-xl text-gray-600">Please log in to view your schedule of received bookings.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center">
                <FaCalendarCheck className="mr-3" /> My Schedule ({bookings.length})
            </h1>

            {bookings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                    <FaCalendarCheck className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 mb-2 font-semibold">No Scheduled Bookings</p>
                    <p className="text-gray-500">
                        Bookings for your services will appear here once customers book them.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto bg-white shadow-xl rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Scheduled Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => {
                                    const nextStatus = getNextStatus(booking.status);
                                    return (
                                        <tr key={booking._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={booking.serviceImage}
                                                        alt={booking.serviceName}
                                                        className="w-12 h-12 rounded-lg object-cover mr-3"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {booking.serviceName}
                                                        </p>
                                                        {booking.specialInstruction && (
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                                                Note: {booking.specialInstruction}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {booking.userName}
                                                </p>
                                                <p className="text-xs text-gray-500">{booking.userEmail}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                {booking.serviceTakingDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                                ${booking.servicePrice}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    <span className="ml-1">{booking.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {nextStatus ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, nextStatus)}
                                                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition duration-200"
                                                    >
                                                        Mark as {nextStatus}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-green-600 font-semibold">
                                                        ✓ Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (remains the same) */}
                    <div className="md:hidden space-y-4">
                        {bookings.map((booking) => {
                            const nextStatus = getNextStatus(booking.status);
                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                                >
                                    {/* Service Image & Name */}
                                    <div className="relative">
                                        <img
                                            src={booking.serviceImage}
                                            alt={booking.serviceName}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                <span className="ml-1">{booking.status}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        {/* Service Name */}
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {booking.serviceName}
                                        </h3>

                                        {/* Customer Info */}
                                        <div className="flex items-start space-x-2 text-sm bg-indigo-50 p-3 rounded-lg">
                                            <FaUser className="text-indigo-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{booking.userName}</p>
                                                <p className="text-gray-600 text-xs">{booking.userEmail}</p>
                                            </div>
                                        </div>

                                        {/* Scheduled Date */}
                                        <div className="flex items-center text-sm bg-gray-50 p-3 rounded-lg">
                                            <FaCalendarCheck className="text-indigo-600 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">Scheduled Date</p>
                                                <p className="font-semibold text-gray-800">{booking.serviceTakingDate}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center text-sm bg-green-50 p-3 rounded-lg">
                                            <FaDollarSign className="text-green-600 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">Service Price</p>
                                                <p className="font-bold text-green-600 text-lg">${booking.servicePrice}</p>
                                            </div>
                                        </div>

                                        {/* Special Instructions */}
                                        {booking.specialInstruction && (
                                            <div className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                <p className="text-xs text-gray-500 mb-1">Special Instructions:</p>
                                                <p className="text-gray-700">{booking.specialInstruction}</p>
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        {nextStatus ? (
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, nextStatus)}
                                                className="w-full px-4 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
                                            >
                                                Mark as {nextStatus}
                                            </button>
                                        ) : (
                                            <div className="w-full text-center py-3 bg-green-100 text-green-700 font-semibold rounded-lg border border-green-300">
                                                ✓ Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default MySchedule;