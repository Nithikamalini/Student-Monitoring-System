import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BulkAttendanceModal = ({ students, onClose, onUpdate }) => {
    const [date, setDate] = useState('');
    const [attendanceData, setAttendanceData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Initialize all students as Present by default
    useEffect(() => {
        const initialData = {};
        students.forEach(student => {
            initialData[student._id] = 'Present';
        });
        setAttendanceData(initialData);

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, [students]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleMarkAll = (status) => {
        const newData = {};
        students.forEach(student => {
            newData[student._id] = status;
        });
        setAttendanceData(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date) {
            alert('Please select a date.');
            return;
        }

        setSubmitting(true);
        try {
            const records = students.map(student => ({
                studentId: student._id,
                status: attendanceData[student._id] || 'Present'
            }));

            await axios.post('/api/students/attendance/bulk', {
                date,
                records
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error recording bulk attendance:', error);
            alert('Error recording attendance. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-blue-50/95 dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-blue-200 dark:border-slate-700">
                
                {/* Header */}
                <div className="p-6 border-b border-blue-100 dark:border-slate-700 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Bulk Mark Attendance</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Mark attendance for all students on a specific date</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full text-2xl">&times;</button>
                </div>

                {/* Controls */}
                <div className="p-6 border-b border-blue-100 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between shrink-0 bg-white/30 dark:bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="p-2 border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quick Actions:</span>
                        <button 
                            type="button" 
                            onClick={() => handleMarkAll('Present')}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm"
                        >
                            Mark All Present
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleMarkAll('Absent')}
                            className="px-4 py-2 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg font-bold hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors text-sm"
                        >
                            Mark All Absent
                        </button>
                    </div>
                </div>

                {/* Student List */}
                <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                    <form id="bulk-attendance-form" onSubmit={handleSubmit}>
                        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-600 text-sm">
                            <thead>
                                <tr className="bg-slate-200 dark:bg-slate-700">
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold w-16 text-center select-none cursor-default">#</th>
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold w-40 select-none cursor-default">Roll No</th>
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold select-none cursor-default">Student Name</th>
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold w-32 text-center select-none cursor-default">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-2 border border-slate-300 dark:border-slate-600 text-center text-slate-500 dark:text-slate-400 font-mono">
                                            {index + 1}
                                        </td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono text-slate-700 dark:text-slate-300">
                                            {student.rollNumber}
                                        </td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-600 font-medium text-slate-900 dark:text-slate-100">
                                            {student.name}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-600 p-0 relative">
                                            <select
                                                value={attendanceData[student._id]}
                                                onChange={(e) => handleStatusChange(student._id, e.target.value)}
                                                className={`w-full h-full p-2 outline-none appearance-none cursor-pointer font-bold text-center ${
                                                    attendanceData[student._id] === 'Present' 
                                                        ? 'bg-transparent text-emerald-600 dark:text-emerald-400' 
                                                        : 'bg-rose-100/50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                                                }`}
                                            >
                                                <option value="Present" className="font-bold text-emerald-600">P - Present</option>
                                                <option value="Absent" className="font-bold text-rose-600">A - Absent</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-blue-100 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-b-[2rem]">
                    <div className="flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            form="bulk-attendance-form"
                            disabled={submitting}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-extrabold hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                        >
                            {submitting ? 'Saving...' : 'Save Bulk Attendance'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BulkAttendanceModal;
