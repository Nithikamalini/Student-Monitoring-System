const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// Register a Student
router.post('/register', async (req, res) => {
    try {
        const { name, rollNumber, email, attendancePercentage, averageMarks } = req.body;
        const newStudent = new Student({
            name,
            rollNumber,
            email,
            attendancePercentage: attendancePercentage !== undefined && attendancePercentage !== '' ? parseFloat(attendancePercentage) : null,
            averageMarks: averageMarks !== undefined && averageMarks !== '' ? parseFloat(averageMarks) : null
        });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Students with Status
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        const studentData = await Promise.all(students.map(async (student) => {
            // Calculate Attendance (prefer explicitly edited percentage, else calculate)
            let attendancePercentage;
            if (student.attendancePercentage != null && !isNaN(student.attendancePercentage)) {
                attendancePercentage = Number(student.attendancePercentage);
            } else {
                const attendanceRecords = await Attendance.find({ studentId: student._id });
                const totalDays = attendanceRecords.length;
                const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
                attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;
            }

            // Calculate Marks (prefer explicitly edited marks, else calculate)
            let averageMarks;
            if (student.averageMarks != null && !isNaN(student.averageMarks)) {
                averageMarks = Number(student.averageMarks);
            } else {
                const marksRecords = await Marks.find({ studentId: student._id });
                const totalMarksPossible = marksRecords.reduce((acc, curr) => acc + curr.total, 0);
                const totalMarksObtained = marksRecords.reduce((acc, curr) => acc + curr.score, 0);
                averageMarks = totalMarksPossible > 0 ? (totalMarksObtained / totalMarksPossible) * 100 : 100;
            }

            // Risk Assessment
            const isAtRisk = attendancePercentage < 75 || averageMarks < 40;

            return {
                ...student.toObject(),
                attendancePercentage: attendancePercentage.toFixed(2),
                averageMarks: averageMarks.toFixed(2),
                isAtRisk
            };
        }));
        res.json(studentData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark Attendance
router.post('/attendance', async (req, res) => {
    try {
        const { studentId, date, status } = req.body;
        const newAttendance = new Attendance({ studentId, date, status });
        await newAttendance.save();
        // Clear manual override so calculated percentage takes over
        await Student.findByIdAndUpdate(studentId, { attendancePercentage: null });
        res.status(201).json(newAttendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bulk Mark Attendance
router.post('/attendance/bulk', async (req, res) => {
    try {
        const { date, records } = req.body; // records is array of { studentId, status }
        if (!records || !Array.isArray(records) || !date) {
            return res.status(400).json({ error: "Invalid data format" });
        }
        
        const attendanceDocs = records.map(record => ({
            studentId: record.studentId,
            date: date,
            status: record.status
        }));
        
        await Attendance.insertMany(attendanceDocs);
        // Clear manual override for these students
        const studentIds = records.map(r => r.studentId);
        await Student.updateMany({ _id: { $in: studentIds } }, { attendancePercentage: null });
        res.status(201).json({ msg: "Bulk attendance recorded successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Marks
router.post('/marks', async (req, res) => {
    try {
        const { studentId, subject, score, total } = req.body;
        const newMarks = new Marks({ studentId, subject, score, total });
        await newMarks.save();
        // Clear manual override so calculated average takes over
        await Student.findByIdAndUpdate(studentId, { averageMarks: null });
        res.status(201).json(newMarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bulk Add Marks
router.post('/marks/bulk', async (req, res) => {
    try {
        const { subject, total, records } = req.body; // records is array of { studentId, score }
        if (!records || !Array.isArray(records) || !subject || !total) {
            return res.status(400).json({ error: "Invalid data format" });
        }
        
        const marksDocs = records.map(record => ({
            studentId: record.studentId,
            subject: subject,
            score: record.score,
            total: total
        }));
        
        await Marks.insertMany(marksDocs);
        // Clear manual override for these students
        const studentIds = records.map(r => r.studentId);
        await Student.updateMany({ _id: { $in: studentIds } }, { averageMarks: null });
        res.status(201).json({ msg: "Bulk marks recorded successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Student and all related data
router.delete('/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Delete related records first
        await Attendance.deleteMany({ studentId });
        await Marks.deleteMany({ studentId });

        // Delete the student
        const result = await Student.findByIdAndDelete(studentId);

        if (!result) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json({ msg: 'Student and related data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Student Profile (including Attendance and Marks)
router.put('/:id', async (req, res) => {
    try {
        const { name, rollNumber, email, attendancePercentage, averageMarks } = req.body;
        const studentId = req.params.id;

        const updateData = { name, rollNumber, email };

        if (attendancePercentage !== undefined && attendancePercentage !== '') {
            updateData.attendancePercentage = parseFloat(attendancePercentage);
        }
        if (averageMarks !== undefined && averageMarks !== '') {
            updateData.averageMarks = parseFloat(averageMarks);
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
