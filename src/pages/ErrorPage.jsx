import { Link, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4">
            <div className="text-center max-w-2xl">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <FaExclamationTriangle className="text-8xl text-red-500 animate-pulse" />
                        <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Error Heading */}
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
                    Oops!
                </h1>

                <h2 className="text-3xl font-bold text-gray-700 mb-6">
                    Something Went Wrong
                </h2>

                {/* Error Message */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-red-200">
                    <p className="text-lg text-gray-600 mb-2">
                        We're sorry, but the page you're looking for doesn't exist or an unexpected error occurred.
                    </p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
                            <p className="text-sm font-mono text-red-700">
                                <span className="font-semibold">Error:</span>{' '}
                                {error.statusText || error.message || 'Unknown error'}
                            </p>
                            {error.status && (
                                <p className="text-sm font-mono text-red-600 mt-1">
                                    <span className="font-semibold">Status Code:</span> {error.status}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200 shadow-md"
                    >
                        <FaArrowLeft className="mr-2" />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
                    >
                        <FaHome className="mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Additional Help Text */}
                <p className="mt-8 text-gray-500 text-sm">
                    If this problem persists, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;