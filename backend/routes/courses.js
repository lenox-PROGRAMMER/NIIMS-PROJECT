const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

// Get all courses (for admin/lecturer dropdowns)
router.get("/", authenticate, verifyToken(["admin", "lecturer"]), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title FROM courses ORDER BY title ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(" Error fetching courses:", err.message);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

//  Get lecturers linked to a course (admin only)
router.get("/:id/lecturers", authenticate, verifyToken(["admin"]), async (req, res) => {
  const courseId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email
       FROM users u
       JOIN lecturers l ON u.id = l.user_id
       WHERE l.course_id = $1`,
      [courseId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(` Error fetching lecturers for course ${courseId}:`, err.message);
    res.status(500).json({ message: "Could not fetch lecturers." });
  }
});

module.exports = router;
