import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AnalysisResult = ({ onBack }) => {

    const navigate = useNavigate();

    const location = useLocation();

    const finalData =
        location.state ||
        JSON.parse(localStorage.getItem("analysisData"));
   
    if (!finalData) {
        return (
            <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center font-sans">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">No Analysis Data Found</h2>
                    <p className="text-sm text-gray-400 mb-4">Please upload your resume from the dashboard first.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#00F2FE] text-[#0F2027] font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4 md:p-8 font-sans">

            {/*main container */}
            <div
                className="w-full max-w-6xl rounded-3xl shadow-2xl flex min-h-[650px] overflow-hidden relative bg-cover bg-center p-4 md:p-8"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15, 32, 39, 0.7), rgba(44, 83, 100, 0.95)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')`
                }}
            >
                <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 md:p-8 flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {/* header section*/}
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">AI Analysis Result</h2>
                            <p className="text-xs text-gray-400">Deep insights and tailormade suggestions for your profile</p>
                        </div>
                        <button
                            onClick={onBack || (() => navigate('/dashboard'))}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                            ← Analyze New
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-400 flex flex-col items-center justify-center bg-white shadow-sm">
                                <span className="text-lg md:text-xl font-black text-gray-800">{Math.round(finalData.matchScore)}%</span>
                                <span className="text-[9px] text-gray-400 font-medium">Match Score</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-emerald-400 flex flex-col items-center justify-center bg-white shadow-sm">
                                <span className="text-lg md:text-xl font-black text-gray-800">{finalData.matchedSkills.length}</span>
                                <span className="text-[9px] text-gray-400 font-medium">Matched Skills</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-rose-400 flex flex-col items-center justify-center bg-white shadow-sm">
                                <span className="text-lg md:text-xl font-black text-gray-800">{finalData.missingSkills.length}</span>
                                <span className="text-[9px] text-gray-400 font-medium">Missing Skills</span>
                            </div>
                        </div>
                    </div>

                    {finalData.suggestions && finalData.suggestions.length > 0 && (
                        <div className="bg-purple-50 border-l-4 border-[#7C4EE4] p-4 rounded-r-xl mb-6">
                            <h4 className="text-xs font-bold text-[#7C4EE4] uppercase tracking-wide mb-1">AI Suggestion</h4>
                            <p className="text-xs text-gray-700 font-medium leading-relaxed">{finalData.suggestions[0]}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Matched Skills  */}
                        <div className="border border-gray-100 rounded-xl p-4 bg-emerald-50/20">
                            <h4 className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wide">Matched Skills</h4>
                            <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                                {finalData.matchedSkills.map((skill, i) => (
                                    <span key={i} className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                        ✓ {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="border border-gray-100 rounded-xl p-4 bg-rose-50/20">
                            <h4 className="text-xs font-bold text-rose-600 mb-3 uppercase tracking-wide">Missing Skills (Add to Resume)</h4>
                            <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                                {finalData.missingSkills.map((skill, i) => (
                                    <span key={i} className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                                        + {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* botton section */}
                    <div className="border border-gray-200 rounded-xl p-5 bg-slate-50/80">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">AI Improved Version Preview</h4>
                        </div>

                        <div className="space-y-5 overflow-visible pr-2 text-left bg-white p-4 rounded-lg border border-gray-100">                            <div>
                            <h5 className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Professional Summary</h5>
                            <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">{finalData.improvedResume.summary}</p>
                        </div>

                            {/* Improved Skills */}

                            <div>
                                <h5 className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                                    Improved Skills
                                </h5>

                                <div className="flex flex-wrap gap-2 mt-2">

                                    {finalData.improvedResume.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="text-[11px] bg-purple-50 text-purple-700 px-2 py-1 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}

                                </div>
                            </div>
                            {/* Experience  */}
                            <div>
                                <h5 className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-2">Suggested Work Experience</h5>
                                <div className="space-y-3">
                                    {finalData.improvedResume?.experience.map((exp, i) => {
                                        if (typeof exp === 'object' && exp !== null) {
                                            return (
                                                <div key={i} className="border-l-2 border-gray-200 pl-3 py-0.5">
                                                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                                                        <h6 className="text-xs font-bold text-gray-800">
                                                            {exp.company}
                                                        </h6>

                                                        <span className="text-[10px] font-semibold text-gray-400">
                                                            {exp.duration}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                        {exp.position}
                                                    </p>

                                                    <ul className="mt-2 list-disc ml-4">
                                                        {exp.responsibilities?.map((item, index) => (
                                                            <li key={index} className="text-xs text-gray-700">
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }
                                        return typeof exp === 'string' && !exp.includes("Pvt Ltd") ? (
                                            <p key={i} className="text-xs text-gray-700 list-item list-inside ml-1 leading-relaxed">{exp}</p>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Projects */}
                            <div>
                                <h5 className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-2">
                                    Optimized Projects Section
                                </h5>

                                <div className="space-y-4">

                                    {finalData.improvedResume?.projects?.map((proj, i) => (

                                        <div
                                            key={i}
                                            className="border-l-2 border-purple-200 pl-3 py-2"
                                        >
                                            <div className="flex justify-between items-baseline flex-wrap gap-1">
                                                <h6 className="text-xs font-bold text-gray-800">
                                                    {proj.name}
                                                </h6>
                                                {proj.dates && (
                                                    <span className="text-[10px] font-semibold text-gray-400">
                                                        {proj.dates}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line break-words">
                                                {proj.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {proj.technologies?.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-4 mt-3">
                                                {proj.live_url && (<a
                                                    href={proj.url || proj.live_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"
                                                >
                                                    🔗 Live Link
                                                </a>
                                                )}

                                                {(proj.github || proj.github_url) && (
                                                    <a
                                                        href={proj.github || proj.github_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] font-bold text-gray-700 hover:underline flex items-center gap-0.5"
                                                    >
                                                        📦 GitHub
                                                    </a>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={onBack || (() => navigate('/dashboard'))}
                            className="bg-[#00F2FE] hover:bg-[#00D2DE] text-[#0F2027] font-bold text-xs px-12 py-3 rounded-xl transition duration-200 shadow-[0_0_15px_rgba(0,242,254,0.3)] cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AnalysisResult;