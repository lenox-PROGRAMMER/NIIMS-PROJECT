import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

// Pages
import DashboardPage from "./Pages/DashboardPage";
import AdminPage from "./Pages/AdminPage";
import Login from "./Pages/Login";

// Lecturer Panels
import LecturerShell from "./components/lecturer/LecturerShell";
import LecturerStudentSearch from "./components/lecturer/LecturerStudentSearch";

// Student Panel
import StudentDashboard from "./components/sections/StudentDashboard";

// 🔐 Apply token on first render
const applyTokenFromStorage = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// 🛡️ Route guard by role
const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

// 🔁 Redirect root URL based on stored role
const AutoRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") navigate("/admin");
    else if (role === "lecturer") navigate("/lecturer/dashboard");
    else if (role === "student") navigate("/student/dashboard");
    else navigate("/login");
  }, [navigate]);

  return <div>Redirecting...</div>;
};

const App = () => {
  useEffect(() => {
    applyTokenFromStorage();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Root route: detect and redirect to appropriate dashboard */}
        <Route path="/" element={<AutoRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRole="admin">
              <AdminPage />
            </PrivateRoute>
          }
        />

        {/* Lecturer Views */}
        <Route
          path="/lecturer/dashboard"
          element={
            <PrivateRoute allowedRole="lecturer">
              <LecturerShell lecturerId="niims_lecturer_001" />
            </PrivateRoute>
          }
        />
        <Route
          path="/lecturer/students"
          element={
            <PrivateRoute allowedRole="lecturer">
              <LecturerStudentSearch lecturerId="niims_lecturer_001" />
            </PrivateRoute>
          }
        />

        {/* Student Panel */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute allowedRole="student">
              <StudentDashboard studentId="niims_student_001" studentName="John Doe" />
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
