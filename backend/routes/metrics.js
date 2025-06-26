const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

//  Dashboard metrics for Admin Panel
router.get("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const [students, lecturers, latestStudent] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'student'`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'lecturer'`),
      pool.query(`
        SELECT u.name, s.admission_number AS "regNo"
        FROM users u
        JOIN students s ON u.id = s.user_id
        WHERE u.role = 'student'
        ORDER BY u."createdAt" DESC
        LIMIT 1
      `)
    ]);

    res.status(200).json({
      totalStudents: parseInt(students.rows[0]?.count || "0", 10),
      totalLecturers: parseInt(lecturers.rows[0]?.count || "0", 10),
      latestStudent: latestStudent.rows[0] || null
    });
  } catch (err) {
    console.error(" Metrics load failed:", err.message);
    res.status(500).json({ message: "Could not load dashboard metrics." });
  }
});

module.exports = router;
