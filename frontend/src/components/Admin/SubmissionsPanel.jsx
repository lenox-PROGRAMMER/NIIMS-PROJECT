// src/components/admin/SubmissionsPanel.jsx
import React from "react";
import "../../styles/SubmissionsPanel.css";
const SubmissionsPanel = () => {
  return (
    <div className="admin-panel-wrapper">
      <h3 className="panel-heading">📥 Student Project Submissions</h3>
      <p className="panel-subtext">Live feed of student submissions will appear here.</p>

      {/* Future: map student submissions here */}
      {/* <SubmissionList submissions={data} /> */}
    </div>
  );
};

export default SubmissionsPanel;
