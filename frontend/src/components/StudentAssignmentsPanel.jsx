import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/StudentDashboard.css";

// Core dashboard sections
import AvailableHostels from "./sections/AvailableHostels";
import FeeBalance from "./sections/FeeBalance";
import CourseEnrollment from "./sections/CourseEnrollment";
import Settings from "./sections/Settings";
import ExamTimetable from "./sections/ExamTimetable";
import Messages from "./sections/Messages";
import SubmitAssignment from "./sections/SubmitAssignment";
import GitHubRepo from "./sections/GitHubRepo";

// Student-specific panels
import StudentAssignmentsPanel from "../sections/student/StudentAssignmentsPanel";
import StudentExamSchedule from "../sections/student/StudentExamSchedule";


const StudentDashboard = ({ studentName, studentId }) => {
  const [section, setSection] = useState("hostels");

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
        <div className="welcome-banner">
          <h1>Welcome to Your Dashboard, {studentName || "Student"}!</h1>
        </div>
        <div className="dashboard-section">{renderSection()}</div>
      </main>
    </div>
  );
};

export default StudentDashboard;
