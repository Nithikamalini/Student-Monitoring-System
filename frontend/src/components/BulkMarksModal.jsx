import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BulkMarksModal = ({ students, onClose, onUpdate }) => {
    const [subject, setSubject] = useState('');
    const [total, setTotal] = useState(100);
    const [marksData, setMarksData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Initialize all students with empty score
    useEffect(() => {
        const initialData = {};
        students.forEach(student => {
            initialData[student._id] = '';
        });
        setMarksData(initialData);
    }, [students]);

    const handleScoreChange = (studentId, score) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: score
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim()) {
            alert('Please enter a subject name.');
            return;
        }

        setSubmitting(true);
        try {
            // Filter out students who don't have a score entered yet
            const records = students
                .filter(student => marksData[student._id] !== undefined && marksData[student._id] !== '')
                .map(student => ({
                    studentId: student._id,
                    score: Number(marksData[student._id])
                }));

            if (records.length === 0) {
                alert('Please enter at least one score.');
                setSubmitting(false);
                return;
            }

            await axios.post('/api/students/marks/bulk', {
                subject,
                total: Number(total),
                records
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error recording bulk marks:', error);
            alert('Error recording marks. Please try again.');
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
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Bulk Enter Marks</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Enter test scores for multiple students at once</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full text-2xl">&times;</button>
                </div>

                {/* Controls */}
                <div className="p-6 border-b border-blue-100 dark:border-slate-700 flex flex-wrap gap-6 items-center shrink-0 bg-white/30 dark:bg-slate-800/50">
                    <div className="flex items-center gap-4 flex-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Subject:</label>
                        <input
                            type="text"
                            placeholder="e.g. Midterm Math"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-2 border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Total Marks:</label>
                        <input
                            type="number"
                            min="1"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            className="w-24 p-2 border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-mono text-center"
                            required
                        />
                    </div>
                </div>

                {/* Student List Grid (Excel style) */}
                <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                    <form id="bulk-marks-form" onSubmit={handleSubmit}>
                        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-600 text-sm">
                            <thead>
                                <tr className="bg-slate-200 dark:bg-slate-700">
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold w-16 text-center select-none cursor-default">#</th>
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold w-40 select-none cursor-default">Roll No</th>
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold select-none cursor-default">Student Name</th>
                                    <th className="p-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold w-32 text-center select-none cursor-default">Score</th>
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
                                        <td className="border border-slate-300 dark:border-slate-600 p-0 relative bg-white dark:bg-slate-900 overflow-hidden">
                                            <input
                                                type="number"
                                                min="0"
                                                max={total}
                                                step="0.01"
                                                value={marksData[student._id] || ''}
                                                onChange={(e) => handleScoreChange(student._id, e.target.value)}
                                                className="w-full h-full p-2 outline-none bg-transparent font-mono text-center font-bold text-blue-600 dark:text-blue-400 placeholder-slate-300 dark:placeholder-slate-600"
                                                placeholder="..."
                                            />
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
                            form="bulk-marks-form"
                            disabled={submitting}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-extrabold hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                        >
                            {submitting ? 'Saving...' : 'Save Bulk Marks'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BulkMarksModal;
