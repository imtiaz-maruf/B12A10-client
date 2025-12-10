import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaSave, FaEdit, FaSpinner } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://b12-a10-server-59nx.vercel.app';

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/services/${id}`)
            .then(res => {
                const service = res.data;
                setFormData({
                    ...service,
                    price: service.price.toString(),
                });
            })
            .catch(err => {
                console.error("Fetch Service for Edit error:", err);
                toast.error('Failed to load service data for editing.');
                navigate('/my-services');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedData = {
            ...formData,
            price: parseFloat(formData.price),
        };

        try {
            const token = await user.getIdToken();
            const response = await axios.put(
                `${API_BASE_URL}/services/${id}`,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                toast.success('Service updated successfully!');
                navigate('/my-services');
            }
        } catch (error) {
            console.error("Update Service error:", error);
            const errorMessage = error.response?.data?.message || 'Failed to update service.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !formData) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl border border-indigo-100">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center">
                <FaEdit className="mr-3" /> Edit Service: {formData.serviceName}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="serviceName"
                            required
                            onChange={handleChange}
                            value={formData.serviceName}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="serviceCategory"
                            required
                            onChange={handleChange}
                            value={formData.serviceCategory}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="HVAC">HVAC</option>
                        </select>
                    </div>

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
                            onChange={handleChange}
                            value={formData.price}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Area <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="serviceArea"
                            required
                            onChange={handleChange}
                            value={formData.serviceArea}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Image URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="serviceImage"
                            required
                            onChange={handleChange}
                            value={formData.serviceImage}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="serviceDescription"
                            rows="4"
                            required
                            onChange={handleChange}
                            value={formData.serviceDescription}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Provider Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                readOnly
                                value={formData.providerName}
                                className="mt-1 block w-full p-3 border border-gray-200 rounded-md bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                readOnly
                                value={formData.providerEmail}
                                className="mt-1 block w-full p-3 border border-gray-200 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-green-300 flex items-center justify-center"
                    >
                        <FaSave className="mr-2" /> {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditService;