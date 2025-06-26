import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import SubmissionsPanel from "./SubmissionsPanel";
import HostelsPanel from "./HostelsPanel";
import UsersPanel from "./UsersPanel";
import StudentsPanel from "./StudentsPanel";
import LecturersPanel from "./LecturersPanel";
import AssignmentsPanel from "./AssignmentsPanel";
import CourseAssignmentsPanel from "./CourseAssignmentsPanel";
import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ adminName }) => {
  const [activePanel, setActivePanel] = useState("submissions");
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    latestStudent: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    axios
      .get("/api/metrics")
      .then((res) => {
        setDashboardStats(res.data);
        setError("");
      })
      .catch((err) => {
        console.warn("Couldn't fetch metrics:", err);
        setError("❌ Failed to load metrics.");
        // Fallback stats (optional)
        setDashboardStats({
          totalStudents: 0,
          totalLecturers: 0,
          latestStudent: null,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <div className="admin-panel-wrapper">📊 Dashboard Overview</div>;
      case "submissions":
        return <SubmissionsPanel />;
      case "hostels":
        return <HostelsPanel />;
      case "users":
        return <UsersPanel />;
      case "students":
        return <StudentsPanel />;
      case "lecturers":
        return <LecturersPanel />;
      case "assignments":
        return <AssignmentsPanel />;
      case "courseAssignments":
        return <CourseAssignmentsPanel />;
      default:
        return <div className="admin-panel-wrapper">Select a panel</div>;
    }
  };

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar activeKey={activePanel} onSelect={setActivePanel} />
      <main className="admin-dashboard-main">
        <div className="admin-banner">
          <h2>👋 Welcome back, {adminName || "Administrator"}!</h2>

          {loading ? (
            <p className="dashboard-loading">⏳ Loading dashboard metrics...</p>
          ) : error ? (
            <p className="dashboard-error">{error}</p>
          ) : (
            <div className="dashboard-summary">
              <div className="stat-box">
                <h4>🎓 Students</h4>
                <p>{dashboardStats.totalStudents}</p>
              </div>
              <div className="stat-box">
                <h4>👨🏽‍🏫 Lecturers</h4>
                <p>{dashboardStats.totalLecturers}</p>
              </div>
              {dashboardStats.latestStudent && (
                <div className="stat-box wide">
                  <h4>📌 Last Registered</h4>
                  <p>
                    {dashboardStats.latestStudent.name} (
                    {dashboardStats.latestStudent.regNo})
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <section>{renderPanel()}</section>
      </main>
    </div>
  );
};

export default AdminDashboard;
