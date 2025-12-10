import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaPlusCircle, FaClipboardList, FaCalendarCheck, FaBookmark, FaHome, FaListAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success('Successfully logged out.');
                setIsDropdownOpen(false);
            })
            .catch(error => {
                console.error(error);
                toast.error('Logout failed.');
            });
    };

    const navItems = (
        <>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600 transition duration-150')}>
                <FaHome className="inline mr-1" /> Home
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600 transition duration-150')}>
                <FaListAlt className="inline mr-1" /> All Services
            </NavLink>
            {user && (
                <>
                    <NavLink to="/add-service" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold md:hidden' : 'text-gray-700 hover:text-indigo-600 transition duration-150 md:hidden')}>
                        <FaPlusCircle className="inline mr-1" /> Add Service
                    </NavLink>
                    <NavLink to="/my-services" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold md:hidden' : 'text-gray-700 hover:text-indigo-600 transition duration-150 md:hidden')}>
                        <FaClipboardList className="inline mr-1" /> My Services
                    </NavLink>
                    <NavLink to="/my-schedule" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold md:hidden' : 'text-gray-700 hover:text-indigo-600 transition duration-150 md:hidden')}>
                        <FaCalendarCheck className="inline mr-1" /> My Schedule
                    </NavLink>
                    <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold md:hidden' : 'text-gray-700 hover:text-indigo-600 transition duration-150 md:hidden')}>
                        <FaBookmark className="inline mr-1" /> My Bookings
                    </NavLink>
                </>
            )}
        </>
    );

    const dashboardDropdownItems = (
        <>
            <Link to="/add-service" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FaPlusCircle className="mr-2 text-indigo-500" /> Add Service
            </Link>
            <Link to="/my-services" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FaClipboardList className="mr-2 text-indigo-500" /> My Services
            </Link>
            <Link to="/my-schedule" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FaCalendarCheck className="mr-2 text-indigo-500" /> My Schedule
            </Link>
            <Link to="/my-bookings" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FaBookmark className="mr-2 text-indigo-500" /> My Bookings
            </Link>
        </>
    );

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-extrabold text-indigo-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        HomeHero
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex md:space-x-8">
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600 transition duration-150')}>Home</NavLink>
                        <NavLink to="/services" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600 transition duration-150')}>All Services</NavLink>
                    </nav>

                    {/* Auth/Profile Section */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                {/* Dashboard Dropdown Button (Desktop Only) */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="hidden md:flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                                >
                                    <FaBars />
                                    <span>Dashboard</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="py-1">
                                            {/* User Info Header */}
                                            <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-3 border-b hover:bg-gray-100">
                                                <img
                                                    src={user.photoURL || 'https://via.placeholder.com/40'}
                                                    alt={user.displayName}
                                                    className="w-8 h-8 rounded-full object-cover mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                                                    <p className="text-xs text-indigo-600">View Profile</p>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="py-1">{dashboardDropdownItems}</div>
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogOut}
                                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <FaSignOutAlt className="mr-2" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium">
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden p-4 bg-gray-50 border-t">
                    <div className="flex flex-col space-y-3">
                        {navItems}
                        {user ? (
                            <>
                                <hr className="border-gray-300 my-2" />
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center">
                                    <FaUserCircle className="inline mr-1 text-indigo-500" /> View Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left text-red-600 hover:text-red-700 font-semibold flex items-center"
                                >
                                    <FaSignOutAlt className="inline mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 font-medium">
                                Login Now
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;