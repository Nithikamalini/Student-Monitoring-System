import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EditStudentModal = ({ student, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: ''
    });

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name,
                rollNumber: student.rollNumber,
                email: student.email
            });
        }
    }, [student]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/students/${student._id}`, formData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error updating student');
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-blue-50/95 dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-blue-200 dark:border-slate-700 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">Edit Student Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 dark:text-blue-400 mb-1 ml-1 uppercase tracking-widest">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            className="w-full p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 dark:text-blue-400 mb-1 ml-1 uppercase tracking-widest">Roll Number</label>
                        <input
                            type="text"
                            placeholder="e.g. BT123"
                            className="w-full p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.rollNumber}
                            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 dark:text-blue-400 mb-1 ml-1 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-blue-100 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-extrabold hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all text-center active:scale-95"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
