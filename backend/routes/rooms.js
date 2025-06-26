const express = require("express");
const router = express.Router();
const { Room, Student, User } = require("../models");
const authenticate = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");

// GET all rooms with occupant data
router.get("/", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: Student,
          as: "occupant",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "email"]
            }
          ]
        }
      ],
      order: [["name", "ASC"]]
    });

    const enriched = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      status: room.status,
      occupant: room.occupant
        ? {
            name: room.occupant.user?.name,
            regNo: room.occupant.admissionNumber
          }
        : null
    }));

    res.status(200).json(enriched);
  } catch (err) {
    console.error(" Failed to fetch rooms:", err.message);
    res.status(500).json({ message: "Could not fetch rooms." });
  }
});

// Assign a student to a room
router.post("/assign", authenticate, verifyToken(["admin"]), async (req, res) => {
  const { studentId, roomId } = req.body;

  try {
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: "Student not found." });

    if (!student.feesCleared) {
      return res.status(403).json({ message: "Student must clear school fees first." });
    }

    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ message: "Room not found." });

    if (room.status !== "available") {
      return res.status(400).json({ message: `Room is currently ${room.status}.` });
    }

    room.occupantId = student.id;
    room.status = "occupied";
    await room.save();

    res.status(200).json({ message: "Room assigned successfully", room });
  } catch (error) {
    console.error(" Assignment error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Lock a room
router.patch("/:id/lock", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found." });

    room.status = "locked";
    await room.save();

    res.status(200).json({ message: "Room locked." });
  } catch (err) {
    console.error("Lock error:", err.message);
    res.status(500).json({ message: "Could not lock room." });
  }
});

//  Unlock a room
router.patch("/:id/unlock", authenticate, verifyToken(["admin"]), async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found." });

    if (room.occupantId) {
      return res
        .status(400)
        .json({ message: "Room is assigned to a student. Unassign first." });
    }

    room.status = "available";
    await room.save();

    res.status(200).json({ message: "Room unlocked." });
  } catch (err) {
    console.error(" Unlock error:", err.message);
    res.status(500).json({ message: "Could not unlock room." });
  }
});

module.exports = router;
