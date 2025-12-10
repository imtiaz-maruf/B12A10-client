import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTimes, FaCalendarAlt, FaCommentDots } from "react-icons/fa";

const API_BASE_URL =
    import.meta.env.VITE_BASE_URL || "https://b12-a10-server-59nx.vercel.app";

const BookingModal = ({ service, isOpen, setIsOpen }) => {
    const { user, loading } = useContext(AuthContext);

    const [serviceTakingDate, setServiceTakingDate] = useState("");
    const [specialInstruction, setSpecialInstruction] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // -------------------------
    // HELPERS
    // -------------------------

    const getUserEmail = () => {
        if (!user) return null;
        return (
            user.email ||
            user.providerData?.[0]?.email ||
            user.reloadUserInfo?.email ||
            null
        );
    };

    const getUserName = () => {
        if (!user) return "Anonymous";
        return (
            user.displayName ||
            user.providerData?.[0]?.displayName ||
            getUserEmail()?.split("@")[0] ||
            "Anonymous"
        );
    };

    if (!isOpen) return null;

    // -------------------------
    // SUBMIT BOOKING
    // -------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return toast.error("Authenticating... Please wait.");
        if (!user) {
            toast.error("You must be logged in to make a booking.");
            return setIsOpen(false);
        }

        const userEmail = getUserEmail();
        const userName = getUserName();

        if (!userEmail) {
            toast.error("Email not found. Please log in again.");
            return;
        }

        if (!serviceTakingDate) {
            toast.error("Please select a service date.");
            return;
        }

        setSubmitting(true);

        try {
            const token = await user.getIdToken();

            const bookingData = {
                serviceId: service._id,
                serviceName: service.serviceName,
                serviceImage: service.serviceImage,
                servicePrice: service.price,

                providerEmail: service.providerEmail,
                providerName: service.providerName || "",

                userEmail,
                userName,

                currentDate: new Date().toISOString().split("T")[0],
                serviceTakingDate,

                specialInstruction: specialInstruction || "",
                status: "Pending",
            };

            const response = await axios.post(
                `${API_BASE_URL}/bookings`,
                bookingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Booking created successfully!");
                setIsOpen(false);
                setServiceTakingDate("");
                setSpecialInstruction("");
            } else {
                toast.error("Booking failed. Try again.");
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.errors?.join(", ") ||
                "Failed to create booking.";

            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    // -------------------------
    // RENDER
    // -------------------------

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-6 rounded-t-xl relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-200"
                        disabled={submitting}
                    >
                        <FaTimes size={22} />
                    </button>
                    <h2 className="text-2xl font-bold">Book Service</h2>
                    <p className="text-indigo-100 mt-1">{service.serviceName}</p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Service Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Service:</span>
                            <span className="font-semibold">{service.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-bold text-green-600">
                                BDT {service.price}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Provider:</span>
                            <span className="font-semibold">{service.providerName}</span>
                        </div>
                    </div>

                    {/* User Display */}
                    {user && getUserEmail() ? (
                        <div className="bg-indigo-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Your Name:</span>
                                <span className="font-semibold">{getUserName()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Your Email:</span>
                                <span className="font-semibold text-sm">{getUserEmail()}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <p className="text-red-600 text-sm">
                                ⚠️ Email not found. Please log in again.
                            </p>
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-indigo-600" />
                            Service Date *
                        </label>
                        <input
                            type="date"
                            value={serviceTakingDate}
                            onChange={(e) => setServiceTakingDate(e.target.value)}
                            min={today}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Instruction */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                            <FaCommentDots className="mr-2 text-indigo-600" />
                            Special Instructions (Optional)
                        </label>
                        <textarea
                            value={specialInstruction}
                            onChange={(e) => setSpecialInstruction(e.target.value)}
                            rows="4"
                            placeholder="Any special requests or notes…"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            disabled={submitting}
                            className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !getUserEmail()}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300"
                        >
                            {submitting ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
