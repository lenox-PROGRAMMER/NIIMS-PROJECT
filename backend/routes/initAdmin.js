const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");

// POST /api/initadmin
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    // Check if an admin already exists
    const existing = await pool.query(
      `SELECT 1 FROM users WHERE role = 'admin' LIMIT 1`
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "An admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'admin', NOW(), NOW())`,
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin account initialized successfully." });
  } catch (err) {
    console.error(" Admin init error:", err);
    res.status(500).json({
      message: "Server error during admin setup.",
      error: err.message
    });
  }
});

module.exports = router;
