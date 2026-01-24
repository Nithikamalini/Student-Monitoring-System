import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useTheme();
    return (
        <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-blue-500/20 hover:bg-white/20 text-white transition-all shadow-inner"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {darkMode ? (
                <svg className="w-5 h-5 text-yellow-300 fill-current shadow-yellow-500" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
}

function LogoutButton() {
    const { logout } = useContext(AuthContext);
    return (
        <button onClick={logout} className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl transition-all border border-white/20 shadow-lg active:scale-95">
            Exit System
        </button>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-blue-50/20 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={
                                <PrivateRoute>
                                    <header className="bg-blue-600 dark:bg-blue-900 shadow-xl transition-colors sticky top-0 z-50">
                                        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                                            <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
                                                <span className="bg-white text-blue-600 px-3 py-1 rounded-xl shadow-inner not-italic">S</span>
                                                Monitoring System
                                            </h1>
                                            <div className="flex items-center gap-6">
                                                <ThemeToggle />
                                                <div className="h-8 w-[1px] bg-blue-400 opacity-30"></div>
                                                <LogoutButton />
                                            </div>
                                        </div>
                                    </header>
                                    <main>
                                        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                                            <Dashboard />
                                        </div>
                                    </main>
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
