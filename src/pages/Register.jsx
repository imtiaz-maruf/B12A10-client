import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
    const { registerUser, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        photoURL: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, password, photoURL } = formData;

        // Password validation
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain at least one uppercase letter");
            return;
        }

        if (!/[a-z]/.test(password)) {
            toast.error("Password must contain at least one lowercase letter");
            return;
        }

        setLoading(true);
        try {
            await registerUser(email, password, name, photoURL);
            toast.success("Registration successful!");
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await googleLogin();
            toast.success("Welcome!");
            navigate(from, { replace: true });
        } catch (err) {
            toast.error("Google login failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-3 border rounded focus:ring focus:ring-indigo-300"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded focus:ring focus:ring-indigo-300"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="photoURL"
                        type="url"
                        placeholder="Photo URL (optional)"
                        className="w-full p-3 border rounded focus:ring focus:ring-indigo-300"
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded focus:ring focus:ring-indigo-300"
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:bg-indigo-300"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="my-4 flex items-center">
                    <div className="flex-grow border-t" />
                    <span className="px-3 text-gray-500">or</span>
                    <div className="flex-grow border-t" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 border p-3 rounded hover:bg-gray-50 transition disabled:opacity-50"
                >
                    <FcGoogle className="text-2xl" /> Continue with Google
                </button>

                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;