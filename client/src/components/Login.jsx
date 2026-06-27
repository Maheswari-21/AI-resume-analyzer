import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyCustomImage from "../assets/ai.png";
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                setSuccess("Login successful!");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);

            } else {
                setError(data.error || 'Invalid Email or Password!');
            }
        } catch (err) {
            console.error("Login failed:", err.message);
            setError('Cannot connect to server!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#F5F6FA] flex items-center justify-center min-h-screen p-4 font-sans">

            {/* main container */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden min-h-[600px]">

                {/*Left Side*/}
                <div
                    className="w-1/2 text-white p-12 flex flex-col justify-end relative hidden md:flex bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(11, 10, 26, 0.3), rgba(11, 10, 26, 0.95)), url(${MyCustomImage})`
                    }}
                >
                    <div className="flex-1"></div>

                    <div className="text-center max-w-sm mx-auto z-10 mb-6">
                        <h3 className="text-xl font-semibold mb-2">Bridge the Gap to Your Dream Career</h3>
                        <p className="text-sm text-gray-300">Instantly analyze your resume against any Job Description. Discover missing skills and boost your ATS score.</p>
                    </div>
                </div>

                {/* Right Side*/}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-1">Login</h2>
                    <p className="text-xs text-gray-400 text-center mb-8">Analyze your resume against job descriptions and boost your score instantly.</p>

                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3 rounded-r-lg mb-4">{error}</div>}
                    {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 text-xs p-3 rounded-r-lg mb-4">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="flex flex-col items-start">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your Email"
                                className="w-full px-4 py-2.5 text-sm border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C4EE4] bg-[#F5F6FA] text-gray-700 placeholder-gray-400 transition"
                            />
                        </div>

                        <div className="flex flex-col items-start">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full px-4 py-2.5 text-sm border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C4EE4] bg-[#F5F6FA] text-gray-700 placeholder-gray-400 transition"
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-slate-950 text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-2 border border-white/20 shadow-xl transition-all duration-300
    
    ${isLoading
                                    ? 'bg-cyan-100/50 backdrop-blur-sm text-slate-500 cursor-not-allowed'
                                    : 'bg-cyan-500/70 backdrop-blur-sm hover:bg-cyan-400/70 shadow-cyan-900/30 cursor-pointer'}`}
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <p className="text-xs text-gray-500 text-center mt-8">
                        Don't have an account Yet?{" "}
                        <a
                            href="/register"
                            className="text-cyan-600 font-semibold hover:text-cyan-600 hover:underline transition-colors"
                        >
                            Sign Up
                        </a>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Login;




