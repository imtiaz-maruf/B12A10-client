import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
    const {
        _id,
        serviceName,
        serviceImage,
        price,
        providerName,
        providerImage,
        averageRating
    } = service;

    return (
        <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition duration-300 bg-white">
            {/* Image */}
            <img
                src={serviceImage}
                alt={serviceName}
                className="w-full h-48 object-cover"
            />

            <div className="p-5 flex flex-col flex-grow">
                {/* Service Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{serviceName}</h3>

                {/* Price and Rating */}
                <div className="flex justify-between items-center mb-4 text-sm">
                    <p className="text-indigo-600 font-semibold text-lg">BDT. {price}</p>
                    <div className="flex items-center text-yellow-500">
                        <FaStar className="mr-1" />
                        <span className="font-medium text-gray-600">
                            {averageRating ? averageRating.toFixed(1) : 'New'}
                        </span>
                    </div>
                </div>

                {/* Provider Info */}
                <div className="flex items-center space-x-3 mt-auto pt-3 border-t border-gray-100">
                    <img
                        src={providerImage || 'https://via.placeholder.com/40'}
                        alt={providerName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium text-gray-700">{providerName}</p>
                </div>

                {/* Details Button */}
                <Link
                    to={`/services/${_id}`}
                    className="mt-4 w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;