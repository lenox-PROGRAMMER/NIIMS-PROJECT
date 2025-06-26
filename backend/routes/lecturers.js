const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

// Register a new lecturer (Admin only)
router.post("/register", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { name, email, password, workNumber, department, courseId } = req.body;

  if (!name || !email || !password || !workNumber || !department || !courseId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'lecturer', NOW(), NOW())
       RETURNING id, name, email`,
      [name.trim(), email.toLowerCase(), hashedPassword]
    );
    const user = userResult.rows[0];

    await pool.query(
      `INSERT INTO lecturers (user_id, work_number, department, course_id)
       VALUES ($1, $2, $3, $4)`,
      [user.id, workNumber.trim(), department.trim(), courseId]
    );

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      workNumber,
      department,
      courseId
    });
  } catch (err) {
    console.error("Lecturer registration error:", err.message);
    if (err.code === "23505") {
      res.status(409).json({ message: "Email or work number already exists." });
    } else {
      res.status(500).json({ message: "Lecturer registration failed." });
    }
  }
});

// Get all lecturers (Admin only)
router.get("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        l.work_number AS "workNumber",
        l.department,
        c.title AS "courseTitle",
        l.course_id
      FROM lecturers l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN courses c ON l.course_id = c.id
      WHERE u.role = 'lecturer'
      ORDER BY u."createdAt" DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(" Failed to fetch lecturers:", err.message);
    res.status(500).json({ message: "Could not load lecturers." });
  }
});

//  Delete lecturer by user ID (Admin only)
router.delete("/:id", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM lecturers WHERE user_id = $1`, [id]);
    await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'lecturer'`, [id]);
    res.status(200).json({ message: "Lecturer deleted." });
  } catch (err) {
    console.error("Failed to delete lecturer:", err.message);
    res.status(500).json({ message: "Could not delete lecturer." });
  }
});

module.exports = router;
