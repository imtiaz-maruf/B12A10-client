import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaLocationDot, FaEnvelope, FaPhone } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
                    {/* Column 1: Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-indigo-400">HomeHero</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Connecting you with trusted local professionals for all your home service needs. Quality, guaranteed.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition duration-150 text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-400 hover:text-indigo-400 transition duration-150 text-sm">
                                    All Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-indigo-400 transition duration-150 text-sm">
                                    Login / Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-400 hover:text-indigo-400 transition duration-150 text-sm">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start text-gray-400">
                                <FaLocationDot className="mr-2 mt-1 text-indigo-400 flex-shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center text-gray-400">
                                <FaEnvelope className="mr-2 text-indigo-400 flex-shrink-0" />
                                <a href="mailto:support@homehero.com" className="hover:text-indigo-400 transition duration-150">
                                    support@homehero.com
                                </a>
                            </li>
                            <li className="flex items-center text-gray-400">
                                <FaPhone className="mr-2 text-indigo-400 flex-shrink-0" />
                                <a href="tel:+8801937232299" className="hover:text-indigo-400 transition duration-150">
                                    +8801937232299
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition duration-150"
                                aria-label="Facebook"
                            >
                                <FaFacebookF size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition duration-150"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition duration-150"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={20} />
                            </a>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm text-gray-400 mb-2">Stay updated with our latest offers</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 text-sm bg-gray-700 text-white border border-gray-600 rounded-l focus:outline-none focus:border-indigo-400"
                                />
                                <button className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 transition duration-150 rounded-r">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} HomeHero. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-indigo-400 transition duration-150">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-indigo-400 transition duration-150">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;