import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCustomImage from "../assets/ai.png";
import api from "../api/axios";
const Dashboard = () => {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [activeTab, setActiveTab] = useState('Upload');
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const handleFileChange = (e) => {

        if (e.target.files?.[0]) {

            setFile(e.target.files[0]);

        }

    };



    const handleAnalyze = async () => {
        setErrorMessage("");

        if (!file || !jobDescription.trim()) {
            setErrorMessage("Please upload a resume and paste the job description!");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("jobDescription", jobDescription);

            const response = await api.post(
                "/analyze",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


            navigate("/analysis-result", {
                state: response.data
            });

        } catch (error) {
            console.error("ANALYZE ERROR:", error.message);

            const serverError = error.response?.data?.error || error.response?.data?.message || "Something went wrong!";

            setErrorMessage(serverError);
        } finally {
            setLoading(false);
        }
    };

    const handleHistory = async () => {

        try {


            const res = await api.get(
                "/analyze/history",
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


            setHistoryData(res.data);
            setActiveTab("History");


        }
        catch (err) {

            console.error("History fetch failed");
        }

    };
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const handleDeleteHistory = async (id) => {
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);

            setTimeout(() => {
                setConfirmDeleteId(null);
            }, 3000);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/analyze/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setHistoryData(historyData.filter((item) => item._id !== id));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Delete failed:", err.message);
            alert(err.response?.data?.error || "Failed to delete history item.");
        }
    };
    const handleLogout = () => {

        localStorage.removeItem("analysisData");
        localStorage.removeItem("token");

        navigate("/login");

    };

    return (
        <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4 md:p-8 font-sans">

            {/* main container*/}
            <div
                className="w-full max-w-6xl rounded-3xl shadow-2xl flex min-h-[620px] overflow-hidden relative bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15, 32, 39, 0.55), rgba(44, 83, 100, 0.85)), url(${MyCustomImage})`
                }}
            >

                {/* left side*/}
                <div className="w-20 md:w-24 bg-white/10 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-8 justify-between shrink-0 z-10">

                    <div className="flex flex-col gap-6 w-full px-2">
                        {/* Upload Tab */}
                        <button
                            onClick={() => setActiveTab('Upload')}
                            className={`flex flex-col items-center gap-1 py-3 w-full rounded-xl transition duration-200 cursor-pointer
                            ${activeTab === 'Upload' ? 'bg-white/20 text-white font-semibold shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="text-[10px] md:text-xs">Upload</span>
                        </button>

                        {/* History Tab */}
                        <button
                            onClick={() => {
                                setActiveTab('History');
                                if (typeof handleHistory === 'function') handleHistory();
                            }}
                            className={`flex flex-col items-center gap-1 py-3 w-full rounded-xl transition duration-200 cursor-pointer
                            ${activeTab === 'History' ? 'bg-white/20 text-white font-semibold shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] md:text-xs">History</span>
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-red-300 hover:text-red-400 transition p-2 rounded-xl hover:bg-white/10 cursor-pointer"
                        title="Logout"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>

                {/* right side */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-between z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">

                    {activeTab === "History" && (
                        <div className="flex-1 flex flex-col items-center justify-center w-full my-auto">
                            <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                                <div className="border-b border-gray-100 pb-3 mb-4">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        ⏱️ Analysis History
                                    </h2>
                                    <p className="text-[11px] text-gray-400 mt-0.5">Review your previously calculated ATS match tracking records</p>
                                </div>

                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                                    {(!historyData || historyData.length === 0) ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 text-xs font-medium italic">No previous history found</p>
                                        </div>
                                    ) : (
                                        historyData.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:shadow-sm transition"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-700">Match Score:</span>
                                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                            {item.matchScore}%
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                                                        📅 Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "26/6/2026"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate("/analysis-result", { state: item })}
                                                        className="bg-[#00F2FE] hover:bg-[#00D2DE] text-[#0F2027] text-[11px] font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                                                    >
                                                        View Result
                                                    </button>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDeleteHistory(item._id)}
                                                            className={`flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer ${confirmDeleteId === item._id
                                                                ? "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                                                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                                }`}
                                                            title={confirmDeleteId === item._id ? "Click again to confirm" : "Delete Record"}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            {confirmDeleteId === item._id && <span>Sure?</span>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "Upload" && (
                        <>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">AI Resume Analyzer...</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                                    {/* Upload Resume */}
                                    <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between min-h-[340px]">
                                        <h3 className="text-base font-bold text-gray-800 mb-4">Upload Resume</h3>

                                        <label className="w-full flex-1 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/30 hover:bg-purple-50/50 transition flex flex-col items-center justify-center p-6 cursor-pointer relative group">
                                            <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />

                                            <div className="w-16 h-16 text-[#7C4EE4] group-hover:scale-110 transition mb-3 flex items-center justify-center">
                                                <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                                </svg>
                                            </div>

                                            <p className="text-sm font-medium text-gray-700">Drop PDF <span className="text-[#7C4EE4] underline">browse</span></p>
                                        </label>

                                        {file && (
                                            <p className="text-xs text-purple-900 mt-3 bg-purple-100 font-semibold px-4 py-1.5 rounded-full text-center max-w-full">
                                                📄 {file.name} | {(file.size / (1024 * 1024)).toFixed(1)} MB
                                            </p>
                                        )}
                                    </div>

                                    {/*Paste Job Description */}
                                    <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[340px]">
                                        <h3 className="text-base font-bold text-gray-800 text-center mb-4">Paste Job Description</h3>

                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="Paste the JD here (Skills, Role, Responsibilities...)"
                                            className="w-full flex-1 p-4 text-sm border border-purple-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C4EE4]/30 focus:border-[#7C4EE4] resize-none text-gray-700 placeholder-gray-400 min-h-[180px]"
                                        />
                                    </div>

                                </div>
                            </div>

                            {errorMessage && (
                                <div className="mt-6 mx-auto w-full max-w-xl bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 px-5 py-3.5 rounded-xl flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="flex-1">{errorMessage}</span>
                                    <button
                                        onClick={() => setErrorMessage("")}
                                        className="text-red-400 hover:text-red-200 p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleAnalyze}
                                    className="bg-[#00F2FE] hover:bg-[#00D2DE] text-[#0F2027] font-bold text-sm px-16 py-3.5 rounded-xl transition duration-200 shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.7)] cursor-pointer tracking-wide"
                                >
                                    {loading ? "Analyzing..." : "Analyze Now"}
                                </button>
                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Dashboard;