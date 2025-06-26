const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

//  Load environment variables
dotenv.config();

//  Core middleware
app.use(cors());
app.use(express.json());

//  Route imports
const authRoutes = require("./routes/auth");
const initAdminRoutes = require("./routes/initAdmin");
const courseRoutes = require("./routes/courses");
const metricsRoutes = require("./routes/metrics");
const studentsRoutes = require("./routes/students");
const lecturerRoutes = require("./routes/lecturers");
const roomRoutes = require("./routes/rooms");
const hostelRoutes = require("./routes/hostels");
const registerStudentRoutes = require("./routes/registerStudent");

//  Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/init-admin", initAdminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/register/student", registerStudentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/hostels", hostelRoutes);

// Root health check
app.get("/", (req, res) => {
  res.send(" NIIMS backend is live and breathing!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Something broke on the server." });
});



// 🚀 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
