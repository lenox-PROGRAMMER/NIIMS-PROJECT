import React, { useState } from "react";

// Styles
import "../../styles/StudentDashboard.css";

// Section Components
import AvailableHostels from "./AvailableHostels";
import FeeBalance from "./FeeBalance";
import CourseEnrollment from "./CourseEnrollment";
import Settings from "./Settings";
import ExamTimetable from "./ExamTimetable";
import Messages from "./Messages";
import SubmitAssignment from "./SubmitAssignment";
import GitHubRepo from "./GitHubRepo";
import StudentAssignmentsPanel from "./StudentAssignmentsPanel";
import StudentExamSchedule from "./StudentExamsSchedule";

// Sidebar
import Sidebar from "../Sidebar";

const StudentDashboard = ({ studentName, studentId }) => {
  const [section, setSection] = useState("hostels");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderSection = () => {
    switch (section) {
      case "hostels":
        return <AvailableHostels />;
      case "fees":
        return <FeeBalance />;
      case "courses":
        return <CourseEnrollment />;
      case "settings":
        return <Settings />;
      case "timetable":
        return <ExamTimetable />;
      case "messages":
        return <Messages />;
      case "submit":
        return <SubmitAssignment />;
      case "github":
        return <GitHubRepo />;
      case "assignments":
        return <StudentAssignmentsPanel studentId={studentId} />;
      case "exams":
        return <StudentExamSchedule studentId={studentId} />;
      default:
        return <div className="section-wrapper">Please select a section.</div>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onNavSelect={(key) => setSection(key)} />
      <main className="dashboard-content-area">
        <div className="welcome-banner" style={styles.banner}>
          <h1>Welcome to Your Dashboard, {studentName || "Student"}!</h1>
          <button onClick={handleLogout} style={styles.logout}>
            🔓 Logout
          </button>
        </div>
        <div className="dashboard-section">{renderSection()}</div>
      </main>
    </div>
  );
};

const styles = {
  banner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  logout: {
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default StudentDashboard;
