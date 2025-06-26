const express = require("express");
const router = express.Router();
const { Hostel } = require("../models");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

//ROUTE: Create a new hostel
router.post("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location are required." });
  }

  try {
    const existing = await Hostel.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "Hostel already exists." });
    }

    const hostel = await Hostel.create({ name, location });
    console.log(` Hostel created: ${hostel.name}`);
    res.status(201).json(hostel);
  } catch (err) {
    console.error(" Failed to create hostel:", err.message);
    res.status(500).json({ message: "Could not create hostel." });
  }
});


router.get("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const hostels = await Hostel.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(hostels);
  } catch (err) {
    console.error(" Failed to fetch hostels:", err.message);
    res.status(500).json({ message: "Could not fetch hostels." });
  }
});

module.exports = router;
