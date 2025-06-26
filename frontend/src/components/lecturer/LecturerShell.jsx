import React, { useState } from "react";
import LecturerSidebar from "./LecturerSidebar";
import LecturerDashboard from "./LecturerDashboard";
import AssignmentsManager from "./AssignmentsManager";
import ExamScheduler from "./ExamScheduler";
import SubmitResultsPanel from "./SubmitResultsPanel";
import LecturerStudentSearch from "./LecturerStudentSearch";
import LecturerAssignmentsView from "./LecturerAssignmentsView";
import "../../styles/LecturerShell.css";

const LecturerShell = ({ lecturerId }) => {
  const [activePanel, setActivePanel] = useState("dashboard");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <LecturerDashboard lecturerId={lecturerId} />;
      case "assignments":
        return <AssignmentsManager lecturerId={lecturerId} />;
      case "viewassignments":
        return <LecturerAssignmentsView lecturerId={lecturerId} />;
      case "exams":
        return <ExamScheduler lecturerId={lecturerId} />;
      case "results":
        return <SubmitResultsPanel lecturerId={lecturerId} />;
      case "students":
        return <LecturerStudentSearch lecturerId={lecturerId} />;
      default:
        return <div className="lecturer-panel">Select a panel</div>;
    }
  };

  return (
    <div className="lecturer-layout">
      <LecturerSidebar onSelect={setActivePanel} />
      <main className="lecturer-main">
        <div className="lecturer-header">
          <h2>Welcome, Lecturer</h2>
          <button onClick={handleLogout} className="logout-button">
            🔓 Logout
          </button>
        </div>
        {renderPanel()}
      </main>
    </div>
  );
};

export default LecturerShell;
