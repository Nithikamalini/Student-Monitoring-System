import React, { useState } from 'react';
import axios from 'axios';

const AddStudentForm = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        attendancePercentage: '',
        averageMarks: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/students/register', formData);
            setFormData({ name: '', rollNumber: '', email: '', attendancePercentage: '', averageMarks: '' });
            onStudentAdded(); // Refresh list
            alert('Student Added Successfully');
        } catch (error) {
            console.error(error);
            alert('Error adding student');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 bg-blue-50/40 dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Add New Student</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-3 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                />
                <input
                    type="text"
                    name="rollNumber"
                    placeholder="Roll Number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="p-3 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="p-3 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    name="attendancePercentage"
                    placeholder="Attendance % (Optional)"
                    value={formData.attendancePercentage}
                    onChange={handleChange}
                    className="p-3 border border-emerald-200 dark:border-emerald-800/50 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    name="averageMarks"
                    placeholder="Avg Marks % (Optional)"
                    value={formData.averageMarks}
                    onChange={handleChange}
                    className="p-3 border border-blue-200 dark:border-blue-800/50 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
            <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none font-bold active:scale-95"
            >
                Add Student
            </button>
        </form>
    );
};

export default AddStudentForm;
