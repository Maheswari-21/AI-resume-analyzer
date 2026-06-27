import React, { useState } from "react";
import MyCustomImage from "../assets/ai.png";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            setError("Password do not match");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Registration successful!');

                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                navigate("/login");
            } else {
                setError(data.error || 'Something went wrong!');
            }
        } catch (err) {
            console.error("Register failed:", err.message);
            setError('Cannot connect to server! Please check if backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#F3F4F6] flex items-center justify-center min-h-screen p-4 font-sans">
            {/* Main Container */}
            <div className="bg-white rounded-2xl shadow-xl flex max-w-4xl w-full overflow-hidden min-h-[600px]">

                {/* Left Side: Dark Branding Panel */}
                <div
                    className="w-1/2 text-white p-12 flex flex-col justify-end relative hidden md:flex bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(11, 10, 26, 0.3), rgba(11, 10, 26, 0.95)), url(${MyCustomImage})`
                    }}
                >

                    <div className="flex-1 flex flex-col items-center justify-center">
                    </div>


                    {/* Bottom Text */}
                    <div className="text-center max-w-sm mx-auto z-10 mb-6">
                        <h3 className="text-xl font-semibold mb-2">Smart AI Resume Insights</h3>
                        <p className="text-sm text-gray-300">Optimize your resume against job descriptions, fix missing skills, and land your dream job with AI power.</p>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto">

                        {/* Header */}
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Sign Up</h2>
                        <p className="text-xs text-gray-500 text-center mb-6">Analyze your resume against job descriptions and boost your ATS score instantly.</p>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3 rounded-r-lg mb-4 flex items-center gap-2 shadow-sm">
                                <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 text-xs p-3 rounded-r-lg mb-4 flex items-center gap-2 shadow-sm">
                                <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="flex flex-col items-start">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" id="username" value={formData.username} onChange={handleChange} required placeholder="Enter your username" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366F1] bg-gray-50" />
                            </div>

                            <div className="flex flex-col items-start">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366F1] bg-gray-50" />
                            </div>

                            <div className="flex flex-col items-start">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" id="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366F1] bg-gray-50" />
                            </div>

                            <div className="flex flex-col items-start">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm password</label>
                                <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366F1] bg-gray-50" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full text-slate-950 text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 mt-2 border border-white/20 shadow-md transition-all duration-300
      
      ${isLoading ? (
                                        'bg-cyan-100/50 backdrop-blur-sm text-slate-500 cursor-not-allowed'
                                    ) : (
                                        'bg-cyan-500/70 backdrop-blur-sm hover:bg-cyan-400/70 shadow-cyan-900/30 cursor-pointer'
                                    )}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    'Register now'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-xs text-gray-600 text-center mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-cyan-600 font-semibold hover:text-cyan-600 hover:underline transition-colors"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;