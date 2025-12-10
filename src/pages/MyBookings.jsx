import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { FaBookmark, FaSpinner, FaTrash, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://b12-a10-server-59nx.vercel.app";

const MyBookings = () => {
    const { user, loading: authLoading } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Extract email safely
    const getUserEmail = () => {
        if (!user) return null;
        return (
            user.email ||
            user.providerData?.[0]?.email ||
            user.reloadUserInfo?.email ||
            null
        );
    };

    const fetchBookings = async () => {
        const email = getUserEmail();

        if (!email) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const token = await user.getIdToken();

            const response = await axios.get(
                `${API_BASE_URL}/bookings/my-bookings/${email}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = response.data?.data || [];

            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchBookings();
        }
    }, [user, authLoading]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Cancel Booking?",
            text: "Are you sure you want to cancel this service booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = await user.getIdToken();

                    const res = await axios.delete(`${API_BASE_URL}/bookings/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.data.success) {
                        toast.success("Booking cancelled!");
                        setBookings((prev) => prev.filter((b) => b._id !== id));
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                    toast.error("Failed to cancel booking.");
                }
            }
        });
    };

    // ------------------------
    // RENDER LOGIC
    // ------------------------

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    const email = getUserEmail();

    if (!user || !email) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-lg max-w-7xl mx-auto">
                <p className="text-2xl text-red-600 mb-4 font-semibold">Authentication Required</p>
                <p className="text-xl text-gray-600">Please log in to view your bookings.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center">
                <FaBookmark className="mr-3" /> My Bookings ({bookings.length})
            </h1>

            {bookings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600 mb-4">You have no bookings yet.</p>
                    <a href="/services" className="text-indigo-600 hover:underline font-medium">
                        Browse services to make your first booking.
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((book) => (
                        <div
                            key={book._id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
                        >
                            <img src={book.serviceImage} alt={book.serviceName} className="w-full h-48 object-cover" />

                            <div className="p-5 space-y-3">
                                <h3 className="text-xl font-bold text-gray-800 truncate">{book.serviceName}</h3>

                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 border border-yellow-300 text-yellow-700">
                                        {book.status}
                                    </span>

                                    <div className="flex items-center text-green-600 font-semibold">
                                        <FaDollarSign className="mr-1" />
                                        <span>{book.servicePrice}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Provider:</span> {book.providerName || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500">{book.providerEmail}</p>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 bg-indigo-50 p-2 rounded">
                                    <FaCalendarAlt className="mr-2 text-indigo-500" />
                                    <span className="font-medium">Scheduled: {book.serviceTakingDate}</span>
                                </div>

                                {book.specialInstruction && (
                                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                        <span className="font-semibold">Note:</span> {book.specialInstruction}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleDelete(book._id)}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                                >
                                    <FaTrash className="mr-2" /> Cancel Booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
