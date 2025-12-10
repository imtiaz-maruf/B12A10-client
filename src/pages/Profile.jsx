import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { FaUserCircle, FaEnvelope, FaImage, FaClock, FaSpinner } from 'react-icons/fa';

const Profile = () => {
    // Access user and loading state from context
    const { user, loading: authLoading } = useContext(AuthContext);

    /**
     * Helper to safely extract the user's email, similar to your MyBookings component
     */
    const getSafeEmail = (currentUser) => {
        if (!currentUser) return null;
        return (
            currentUser.email ||
            currentUser.providerData?.[0]?.email ||
            currentUser.reloadUserInfo?.email ||
            null
        );
    };

    // Show loading spinner while authentication is in progress
    if (authLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    // Handle case where user is not logged in after loading
    if (!user) {
        return (
            <div className="text-center py-20 text-xl font-semibold text-red-600">
                Please log in to view your profile.
            </div>
        );
    }

    // Safely retrieve email for display
    const userEmail = getSafeEmail(user) || "Email not available";

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-indigo-100">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center">
                <FaUserCircle className="mr-3" /> Your Profile
            </h1>

            <div className="flex flex-col items-center space-y-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
                    <img
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        alt={user.displayName}
                        className="w-full h-full object-cover"
                    />
                </div>

                <h2 className="text-3xl font-extrabold text-gray-800">{user.displayName || 'User'}</h2>
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex items-center p-4 bg-indigo-50 rounded-lg shadow-sm">
                    <FaEnvelope className="text-indigo-600 mr-4 text-xl" />
                    <div>
                        <p className="text-sm font-medium text-gray-600">Email Address</p>
                        <p className="text-lg font-semibold text-gray-800">{userEmail}</p> {/* Use the safe email */}
                    </div>
                </div>

                {user.photoURL && (
                    <div className="flex items-center p-4 bg-indigo-50 rounded-lg shadow-sm">
                        <FaImage className="text-indigo-600 mr-4 text-xl" />
                        <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-600">Profile Image URL</p>
                            <p className="text-sm text-gray-800 truncate">{user.photoURL}</p>
                        </div>
                    </div>
                )}

                {user.metadata?.lastSignInTime && (
                    <div className="flex items-center p-4 bg-indigo-50 rounded-lg shadow-sm">
                        <FaClock className="text-indigo-600 mr-4 text-xl" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Last Sign In</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {new Date(user.metadata.lastSignInTime).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;