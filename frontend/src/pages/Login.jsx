import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [role, setRole] = useState('admin');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let success;
        if (isRegistering) {
            success = await register(email, password, role);
        } else {
            success = await login(email, password);
        }
        setLoading(false);

        if (success) {
            navigate('/');
        } else {
            alert('Authentication Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">
            {/* Animated Background Blobs - All Blue/Cyan */}
            <div className="absolute top-0 -left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-blue-900/5 backdrop-blur-2xl border border-blue-500/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Top Accent Bar - Blue Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400"></div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/40 mb-6 transform transition-transform hover:scale-110">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.519 1.116-3.113 1.389-4.773" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-blue-200/70 font-medium italic">
                            {isRegistering ? 'Join our elite monitoring network' : 'Secure access to student stats'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-blue-200 ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-5 py-4 bg-blue-50/5 border border-blue-500/10 rounded-2xl text-white placeholder-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-900/20 transition-all duration-300"
                                placeholder="name@university.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-blue-200 ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-5 py-4 bg-blue-50/5 border border-blue-500/10 rounded-2xl text-white placeholder-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-900/20 transition-all duration-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {isRegistering && (
                            <div className="space-y-1 animate-fadeIn">
                                <label className="block text-sm font-semibold text-blue-200 ml-1">Account Type</label>
                                <select
                                    className="w-full px-5 py-4 bg-blue-50/5 border border-blue-500/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-900/20 transition-all appearance-none cursor-pointer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="admin" className="bg-slate-900">Admin / Faculty</option>
                                    <option value="student" className="bg-slate-900">Student</option>
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-600/30 transform transition-all active:scale-[0.98] disabled:opacity-50 mt-6 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>{isRegistering ? 'Create Secure Profile' : 'Enter Dashboard'}</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <div className="text-center pt-4">
                            <button
                                type="button"
                                className="text-blue-300/80 hover:text-white text-sm font-medium transition-colors"
                                onClick={() => setIsRegistering(!isRegistering)}
                            >
                                {isRegistering ? 'Already registered? Sign in here' : 'New to monitoring? Create account'}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-8 text-blue-500/40 text-xs tracking-widest uppercase italic">
                    Blue Protocol Architecture • v3.0
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default Login;
