import { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import { FaPlusCircle, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://b12-a10-server-59nx.vercel.app";

const AddService = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initial state set to empty strings. The provider fields will be populated by useEffect.
    const [formData, setFormData] = useState({
        serviceName: "",
        serviceCategory: "Plumbing", // Default category
        price: "",
        serviceArea: "",
        serviceDescription: "",
        serviceImage: "",
        providerName: "",
        providerEmail: "",
        providerImage: "",
    });

    /**
     * Helper to safely extract the user's email, checking multiple locations (like MyBookings).
     */
    const getSafeEmail = (currentUser) => {
        if (!currentUser) return "";
        return (
            currentUser.email ||
            currentUser.providerData?.[0]?.email ||
            currentUser.reloadUserInfo?.email ||
            ""
        );
    };

    /**
     * FIX: Use useEffect to populate provider details only when the user object is ready/updates.
     */
    useEffect(() => {
        if (user) {
            const safeEmail = getSafeEmail(user);

            // Only update provider fields, preserve user input for service fields
            setFormData(prev => ({
                ...prev,
                providerName: user.displayName || prev.providerName || "",
                providerEmail: safeEmail || prev.providerEmail || "", // Use the safely extracted email
                providerImage: user.photoURL || prev.providerImage || "",
            }));
        }
    }, [user]); // Depend on the 'user' object from context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check for authentication completion before proceeding
            const safeEmail = getSafeEmail(user);

            if (!user || !safeEmail) {
                toast.error("Authentication incomplete. Please log in again.");
                setLoading(false);
                return;
            }

            const token = await user.getIdToken();

            const serviceData = {
                ...formData,
                // Ensure email is correctly sent from state
                providerEmail: formData.providerEmail,
                price: Number(formData.price),
            };

            const response = await axios.post(
                `${API_BASE_URL}/services`,
                serviceData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Service added successfully!");
                // Reset form state after successful submission (optional, but good practice)
                setFormData(prev => ({
                    ...prev,
                    serviceName: "",
                    price: "",
                    serviceArea: "",
                    serviceDescription: "",
                    serviceImage: "",
                }));
                navigate('/my-services');
            }
        } catch (error) {
            console.error("Add Service Error:", error);
            const msg = error.response?.data?.message || "Failed to add service.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Show loading spinner if authentication is still processing
    if (authLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl border">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6 flex items-center justify-center">
                <FaPlusCircle className="mr-3" /> Add New Service
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="serviceName"
                            required
                            placeholder="e.g., Kitchen Sink Repair"
                            value={formData.serviceName}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="serviceCategory"
                            value={formData.serviceCategory}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="HVAC">HVAC</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            step="0.01"
                            placeholder="50.00"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Service Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Area <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="serviceArea"
                            required
                            placeholder="e.g., New York, NY"
                            value={formData.serviceArea}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Image URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="serviceImage"
                            required
                            placeholder="https://example.com/image.jpg"
                            value={formData.serviceImage}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="serviceDescription"
                            rows="4"
                            required
                            placeholder="Describe your service in detail..."
                            value={formData.serviceDescription}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Provider Information Section */}
                <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Provider Information (Read Only)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input
                            type="text"
                            value={formData.providerName}
                            readOnly
                            className="p-3 border rounded-md bg-gray-100"
                            placeholder="Provider Name (Loading...)"
                        />
                        <input
                            type="email"
                            value={formData.providerEmail}
                            readOnly
                            className="p-3 border rounded-md bg-gray-100"
                            placeholder="Provider Email (Loading...)"
                        />
                        <input
                            type="url"
                            value={formData.providerImage}
                            readOnly
                            className="p-3 border rounded-md bg-gray-100"
                            placeholder="Provider Image URL (Loading...)"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.providerEmail} // Disable if adding or email hasn't loaded yet
                    className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-200 font-semibold"
                >
                    {loading ? "Adding Service..." : "Add Service"}
                </button>
            </form>
        </div>
    );
};

export default AddService;