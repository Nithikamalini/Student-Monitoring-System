import React, { useState } from 'react';
import axios from 'axios';

const RecordActionModal = ({ student, onClose, onUpdate }) => {
    const [actionType, setActionType] = useState('attendance'); // 'attendance' or 'marks'
    const [attendanceData, setAttendanceData] = useState({ date: '', status: 'Present' });
    const [marksData, setMarksData] = useState({ subject: '', score: '', total: 100 });

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/students/attendance', {
                studentId: student._id,
                ...attendanceData
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error recording attendance');
        }
    };

    const handleMarksSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/students/marks', {
                studentId: student._id,
                ...marksData
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error recording marks');
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${student.name}? This will also delete all their attendance and marks records.`)) {
            try {
                await axios.delete(`/api/students/${student._id}`);
                onUpdate();
                onClose();
            } catch (error) {
                console.error(error);
                alert('Error deleting student');
            }
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-blue-50/95 dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-blue-200 dark:border-slate-700 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Manage {student.name}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full text-2xl">&times;</button>
                </div>

                <div className="flex mb-6 border-b border-blue-100 dark:border-slate-700">
                    <button
                        className={`px-6 py-3 font-bold transition-all ${actionType === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-blue-400'}`}
                        onClick={() => setActionType('attendance')}
                    >
                        Attendance
                    </button>
                    <button
                        className={`px-6 py-3 font-bold transition-all ${actionType === 'marks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-blue-400'}`}
                        onClick={() => setActionType('marks')}
                    >
                        Marks
                    </button>
                </div>

                {actionType === 'attendance' ? (
                    <form onSubmit={handleAttendanceSubmit} className="space-y-5">
                        <input
                            type="date"
                            value={attendanceData.date}
                            onChange={e => setAttendanceData({ ...attendanceData, date: e.target.value })}
                            className="w-full p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            required
                        />
                        <select
                            value={attendanceData.status}
                            onChange={e => setAttendanceData({ ...attendanceData, status: e.target.value })}
                            className="w-full p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-extrabold hover:bg-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-none transition-all active:scale-95">Save Attendance</button>
                    </form>
                ) : (
                    <form onSubmit={handleMarksSubmit} className="space-y-5">
                        <input
                            type="text"
                            placeholder="Subject"
                            value={marksData.subject}
                            onChange={e => setMarksData({ ...marksData, subject: e.target.value })}
                            className="w-full p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            required
                        />
                        <div className="flex space-x-3">
                            <input
                                type="number"
                                placeholder="Score"
                                value={marksData.score}
                                onChange={e => setMarksData({ ...marksData, score: e.target.value })}
                                className="w-1/2 p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Total"
                                value={marksData.total}
                                onChange={e => setMarksData({ ...marksData, total: e.target.value })}
                                className="w-1/2 p-3.5 border border-blue-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-extrabold hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95">Save Marks</button>
                    </form>
                )}

                <div className="mt-10 pt-6 border-t border-blue-100 dark:border-slate-700">
                    <button
                        onClick={handleDelete}
                        className="w-full bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 py-3 rounded-xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
                    >
                        🗑️ Delete Student Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordActionModal;
