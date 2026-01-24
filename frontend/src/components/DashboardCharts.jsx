import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const DashboardCharts = ({ students }) => {
    // 1. Prepare Data for Bar Chart (Marks)
    const marksData = students.map(student => ({
        name: student.name.split(' ')[0], // First name only for brevity
        Marks: parseFloat(student.averageMarks)
    }));

    // 2. Prepare Data for Pie Chart (Risk Distribution)
    const riskCount = students.filter(s => s.isAtRisk).length;
    const safeCount = students.length - riskCount;
    const riskData = [
        { name: 'Safe', value: safeCount },
        { name: 'At Risk', value: riskCount },
    ];
    const COLORS = ['#10B981', '#EF4444']; // Green, Red

    // 3. Prepare Data for Trends Chart (Mock for demo purposes)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            Attendance: (70 + Math.random() * 25).toFixed(1)
        };
    });

    // 4. Prepare Subject-wise Data (Simulated)
    const subjectData = [
        { subject: 'Math', score: 85 },
        { subject: 'Science', score: 78 },
        { subject: 'English', score: 92 },
        { subject: 'History', score: 65 },
        { subject: 'Geography', score: 88 },
        { subject: 'Art', score: 95 },
    ];

    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Spectrum */}
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 italic tracking-tight">Performance Spectrum</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marksData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b82f6" strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="Marks" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Mastery Radar */}
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 italic tracking-tight">Subject Mastery</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectData}>
                                <PolarGrid stroke="#3b82f6" strokeOpacity={0.1} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Mastery %"
                                    dataKey="score"
                                    stroke="#06b6d4"
                                    fill="#06b6d4"
                                    fillOpacity={0.5}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#f8fafc' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Pie */}
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 italic tracking-tight">Vulnerability Analysis</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Safe' ? '#3b82f6' : '#f43f5e'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#f8fafc' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Momentum Line */}
                <div className="bg-blue-50/40 dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 italic tracking-tight">Momentum Index</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={last7Days}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b82f6" strokeOpacity={0.1} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#f8fafc' }}
                                />
                                <Legend iconType="circle" />
                                <Line
                                    type="monotone"
                                    dataKey="Attendance"
                                    stroke="#06b6d4"
                                    strokeWidth={4}
                                    dot={{ fill: '#06b6d4', r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
