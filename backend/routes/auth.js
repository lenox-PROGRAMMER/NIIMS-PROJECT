const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password || !role) {
    return res.status(400).json({ message: "Missing credentials." });
  }

  try {
    let query = "";
    let values = [identifier];

    switch (role) {
      case "admin":
        query = `SELECT * FROM users WHERE email = $1 AND role = 'admin'`;
        break;

      case "student":
        query = `
          SELECT u.* FROM users u
          JOIN students s ON u.id = s.user_id
          WHERE (s.admission_number = $1 OR u.email = $1)
            AND u.role = 'student'
        `;
        break;

      case "lecturer":
        query = `
          SELECT u.* FROM users u
          JOIN lecturers l ON u.id = l.user_id
          WHERE (l.work_number = $1 OR u.email = $1)
            AND u.role = 'lecturer'
        `;
        break;

      default:
        return res.status(400).json({ message: "Invalid role type." });
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      role: user.role,
      userId: user.id,
      name: user.name
    });

  } catch (err) {
    console.error("🔐 Login error:", err.message);
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
