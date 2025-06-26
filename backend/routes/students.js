const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

//  Fetch all registered students (Admin only)
router.get("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        s.admission_number AS "regNo",
        u.role,
        u."createdAt",
        s.course_id,
        s.lecturer_id,
        c.title AS "courseTitle",
        lu.name AS "lecturerName",
        lu.email AS "lecturerEmail",
        s.fees_cleared AS "feesCleared",
        s.payment_mode AS "paymentMode",
        s.payment_ref AS "paymentRef"
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN lecturers l ON s.lecturer_id = l.id
      LEFT JOIN users lu ON l.user_id = lu.id
      WHERE u.role = 'student'
      ORDER BY u."createdAt" DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(" Failed to load students:", err.message);
    res.status(500).json({ message: "Could not fetch student list." });
  }
});

// Register a new student
router.post("/register", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { name, email, regNo, password, courseId, lecturerId } = req.body;

  if (!name || !email || !regNo || !password || !courseId || !lecturerId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await pool.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id`,
      [name, email, hashedPassword]
    );

    const userId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO students (user_id, admission_number, course_id, lecturer_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, regNo, courseId, lecturerId]
    );

    res.status(201).json({
      id: userId,
      name,
      email,
      regNo,
      course_id: courseId,
      lecturer_id: lecturerId
    });
  } catch (err) {
    console.error(" Failed to register student:", err.message);
    res.status(500).json({ message: "Registration failed." });
  }
});

//  Delete a student and their user account
router.delete("/:id", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM students WHERE user_id = $1`, [id]);
    await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'student'`, [id]);
    res.status(200).json({ message: "✅ Student deleted successfully." });
  } catch (err) {
    console.error(" Failed to delete student:", err.message);
    res.status(500).json({ message: "Could not delete student." });
  }
});

// Clear fees for a student (Admin only)
router.patch("/:id/clear-fees", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { paymentMode, paymentRef } = req.body;
  const { id } = req.params;

  if (!paymentMode || !paymentRef) {
    return res.status(400).json({ message: "Payment mode and reference are required." });
  }

  try {
    await pool.query(
      `UPDATE students 
       SET fees_cleared = true, 
           payment_mode = $1, 
           payment_ref = $2 
       WHERE user_id = $3`,
      [paymentMode, paymentRef, id]
    );
    res.status(200).json({ message: "✅ Fees cleared successfully." });
  } catch (err) {
    console.error(" Payment verification failed:", err.message);
    res.status(500).json({ message: "Could not verify payment." });
  }
});

module.exports = router;
