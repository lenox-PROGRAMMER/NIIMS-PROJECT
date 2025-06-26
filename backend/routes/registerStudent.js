const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

// Register a student (Admin only)
router.post("/register", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { name, email, regNo, password, courseId, lecturerId } = req.body;

  if (!name || !email || !regNo || !password || !courseId || !lecturerId) {
    return res.status(400).json({ message: "⚠️ Missing required fields." });
  }

  try {
    // Prevent duplicate emails
    const emailExists = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (emailExists.rows.length > 0) {
      return res.status(409).json({ message: "⚠️ Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'student', NOW(), NOW())
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    const user = userResult.rows[0];

    await pool.query(
      `INSERT INTO students (user_id, admission_number, course_id, lecturer_id)
       VALUES ($1, $2, $3, $4)`,
      [user.id, regNo, courseId, lecturerId]
    );

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      regNo,
      courseId,
      lecturerId
    });
  } catch (err) {
    console.error(" Register student error:", err.message);
    if (err.code === "23505") {
      // PostgreSQL unique constraint violation
      return res.status(409).json({ message: "🚫 Email or regNo already exists." });
    }
    res.status(500).json({ message: "🚨 Student registration failed." });
  }
});

// Get all students
router.get("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.name, u.email, 
        s.admission_number AS "regNo", 
        s.course_id AS "courseId", 
        s.lecturer_id AS "lecturerId"
      FROM users u
      JOIN students s ON u.id = s.user_id
      WHERE u.role = 'student'
      ORDER BY u."createdAt" DESC
    `);

    res.status(200).json(result.rows || []);
  } catch (err) {
    console.error("Fetch students failed:", err.message);
    res.status(500).json({ message: "Failed to fetch students." });
  }
});

//  Update a student
router.put("/:id", authenticate, verifyToken(["admin"]), async (req, res) => {
  const userId = req.params.id;
  const { name, email, regNo, courseId, lecturerId } = req.body;

  if (!name || !email || !regNo || !courseId || !lecturerId) {
    return res.status(400).json({ message: "⚠️ Missing fields during update." });
  }

  try {
    await pool.query(
      `UPDATE users SET name = $1, email = $2, "updatedAt" = NOW() WHERE id = $3`,
      [name, email, userId]
    );

    await pool.query(
      `UPDATE students SET admission_number = $1, course_id = $2, lecturer_id = $3
       WHERE user_id = $4`,
      [regNo, courseId, lecturerId, userId]
    );

    res.status(200).json({ message: "✅ Student updated successfully." });
  } catch (err) {
    console.error(" Update student failed:", err.message);
    res.status(500).json({ message: "Update failed." });
  }
});

// Delete a student
router.delete("/:id", authenticate, verifyToken(["admin"]), async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query(`DELETE FROM students WHERE user_id = $1`, [userId]);
    await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'student'`, [userId]);

    res.status(200).json({ message: "🗑️ Student deleted." });
  } catch (err) {
    console.error("Delete student failed:", err.message);
    res.status(500).json({ message: "Deletion failed." });
  }
});

module.exports = router;
