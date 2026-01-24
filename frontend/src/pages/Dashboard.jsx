import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddStudentForm from '../components/AddStudentForm';
import RecordActionModal from '../components/RecordActionModal';
import EditStudentModal from '../components/EditStudentModal';
import DashboardCharts from '../components/DashboardCharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const fileInputRef = React.useRef(null);

    const isAdmin = user && user.role === 'admin';

    const fetchStudents = async () => {
        try {
            const res = await axios.get('/api/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleBulkImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const data = lines.slice(1).filter(line => line.trim() !== ''); // Skip header

            let successCount = 0;
            let errorCount = 0;

            for (const line of data) {
                const [name, rollNumber, email] = line.split(',').map(item => item.trim());
                if (name && rollNumber && email) {
                    try {
                        await axios.post('/api/students/register', { name, rollNumber, email });
                        successCount++;
                    } catch (err) {
                        console.error('Error importing:', name, err);
                        errorCount++;
                    }
                }
            }

            alert(`Import Complete! \nSuccess: ${successCount} \nErrors: ${errorCount}`);
            fetchStudents();
            e.target.value = ''; // Reset input
        };
        reader.readAsText(file);
    };

    // Filter and Sort Logic
    const sortedStudents = students
        .filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesStatus = true;
            if (statusFilter === 'At Risk') matchesStatus = student.isAtRisk;
            if (statusFilter === 'Good') matchesStatus = !student.isAtRisk;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            // Sort by name first
            const nameCompare = a.name.localeCompare(b.name);
            if (nameCompare !== 0) return nameCompare;
            // Then by roll number if names are identical
            return a.rollNumber.localeCompare(b.rollNumber);
        });

    // Calculate Stats (on filtered list)
    const totalStudents = sortedStudents.length;
    const atRiskCount = sortedStudents.filter(s => s.isAtRisk).length;
    const avgClassAttendance = totalStudents > 0
        ? (sortedStudents.reduce((acc, s) => acc + parseFloat(s.attendancePercentage), 0) / totalStudents).toFixed(1)
        : 0;

    // Find personal data if student
    const personalData = !isAdmin ? students.find(s => s.email === user.email || s.name === user.name) : null;

    const exportToCSV = () => {
        const headers = ['Name', 'Roll Number', 'Attendance %', 'Avg Marks %', 'Status'];
        const rows = sortedStudents.map(s => [
            s.name,
            s.rollNumber,
            s.attendancePercentage,
            s.averageMarks,
            s.isAtRisk ? 'At Risk' : 'Good'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `student_report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const simulateAlert = (studentName) => {
        alert(`🔔 Alert sent to ${studentName}! \n\nIn a real system, this would send an SMS or Email notification.`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Personal Student Summary */}
            {personalData && (
                <div className="mb-10 animate-fadeIn">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-[1px] rounded-[2rem] shadow-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-500">
                        <div className="bg-white dark:bg-gray-900 rounded-[calc(2rem-1px)] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-3xl shadow-inner">
                                    👤
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                        Hi, {personalData.name}! 👋
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">
                                        Student ID: {personalData.rollNumber} • Personal Portal
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6">
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Attendance</p>
                                    <p className={`text-3xl font-black ${parseFloat(personalData.attendancePercentage) < 75 ? 'text-red-500' : 'text-green-500'}`}>
                                        {personalData.attendancePercentage}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Average</p>
                                    <p className={`text-3xl font-black ${parseFloat(personalData.averageMarks) < 40 ? 'text-red-400' : 'text-indigo-500 text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500'}`}>
                                        {personalData.averageMarks}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-slate-800 dark:text-white">
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:scale-105 transition-transform cursor-default border border-blue-100 dark:border-slate-700">
                    <p className="text-blue-600/70 dark:text-blue-400 text-sm font-semibold uppercase">Total Students</p>
                    <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-rose-500 hover:scale-105 transition-transform cursor-default border border-blue-100 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Students At Risk</p>
                    <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{atRiskCount}</p>
                </div>
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-emerald-500 hover:scale-105 transition-transform cursor-default border border-blue-100 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Avg Attendance</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{avgClassAttendance}%</p>
                </div>
            </div>

            <DashboardCharts students={sortedStudents} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-sans">Student Directory</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search name or roll no..."
                        className="px-4 py-2 border border-blue-100 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-blue-100 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Good">Good</option>
                        <option value="At Risk">At Risk</option>
                    </select>
                    {isAdmin && (
                        <div className="flex gap-3">
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleBulkImport}
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                            >
                                📥 Import CSV
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg hover:shadow-emerald-200 dark:hover:shadow-none"
                            >
                                <span>Export CSV</span>
                            </button>
                        </div>
                    )}
                    {isAdmin && <AddStudentForm onStudentAdded={fetchStudents} />}
                </div>
            </div>

            <div className="bg-blue-50/30 dark:bg-slate-800 shadow-2xl rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 transition-colors">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-4 border-b-2 border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-900/50 text-left text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Name
                            </th>
                            <th className="px-5 py-4 border-b-2 border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-900/50 text-left text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Roll No
                            </th>
                            <th className="px-5 py-4 border-b-2 border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-900/50 text-left text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Attendance %
                            </th>
                            <th className="px-5 py-4 border-b-2 border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-900/50 text-left text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Avg Marks %
                            </th>
                            <th className="px-5 py-4 border-b-2 border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-900/50 text-left text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Status
                            </th>
                            {isAdmin && (
                                <th className="px-5 py-4 border-b-2 border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-900/50 text-left text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50 dark:divide-slate-700">
                        {sortedStudents.length > 0 ? (
                            sortedStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-blue-50/50 dark:hover:bg-slate-900/30 transition-colors duration-200">
                                    <td className="px-5 py-5 border-b border-blue-50 dark:border-slate-700 bg-transparent text-sm font-bold">
                                        <p className="text-slate-900 dark:text-white whitespace-no-wrap">{student.name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-blue-50 dark:border-slate-700 bg-transparent text-sm">
                                        <p className="text-slate-500 dark:text-slate-400 whitespace-no-wrap font-medium">{student.rollNumber}</p>
                                    </td>
                                    <td className={`px-5 py-5 border-b border-blue-50 dark:border-slate-700 bg-transparent text-sm font-black ${parseFloat(student.attendancePercentage) < 75 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {student.attendancePercentage}%
                                    </td>
                                    <td className={`px-5 py-5 border-b border-blue-50 dark:border-slate-700 bg-transparent text-sm font-black ${parseFloat(student.averageMarks) < 40 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {student.averageMarks}%
                                    </td>
                                    <td className="px-5 py-5 border-b border-blue-50 dark:border-slate-700 bg-transparent text-sm">
                                        {student.isAtRisk ? (
                                            <span className="relative inline-block px-4 py-1.5 font-bold text-rose-700 dark:text-rose-300 leading-tight">
                                                <span aria-hidden className="absolute inset-0 bg-rose-100 dark:bg-rose-900/30 opacity-60 rounded-full"></span>
                                                <span className="relative text-xs uppercase tracking-tighter">At Risk</span>
                                            </span>
                                        ) : (
                                            <span className="relative inline-block px-4 py-1.5 font-bold text-emerald-700 dark:text-emerald-300 leading-tight">
                                                <span aria-hidden className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 opacity-60 rounded-full"></span>
                                                <span className="relative text-xs uppercase tracking-tighter">Good</span>
                                            </span>
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-5 py-5 border-b border-blue-50 dark:border-slate-700 bg-transparent text-sm">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-bold underline decoration-blue-200 underline-offset-4"
                                                >
                                                    Manage
                                                </button>
                                                <button
                                                    onClick={() => setEditingStudent(student)}
                                                    className="text-amber-600 dark:text-amber-400 hover:text-amber-800 font-bold underline decoration-amber-200 underline-offset-4"
                                                >
                                                    Edit
                                                </button>
                                                {student.isAtRisk && (
                                                    <button
                                                        onClick={() => simulateAlert(student.name)}
                                                        className="text-rose-500 hover:text-rose-700 transition-transform hover:scale-125"
                                                        title="Send Performance Alert"
                                                    >
                                                        🔔
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 5} className="px-5 py-12 border-b border-blue-50 dark:border-slate-700 bg-transparent text-center text-slate-400 italic">
                                    No students found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedStudent && (
                <RecordActionModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onUpdate={fetchStudents}
                />
            )}
            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    onClose={() => setEditingStudent(null)}
                    onUpdate={fetchStudents}
                />
            )}
        </div>
    );
};

export default Dashboard;

