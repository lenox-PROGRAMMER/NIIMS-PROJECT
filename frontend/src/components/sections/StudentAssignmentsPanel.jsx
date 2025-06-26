import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/StudentAssignmentsPanel.css";


const StudentAssignmentsPanel = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/students/${studentId}/assignments`)
      .then((res) => Array.isArray(res.data) ? setAssignments(res.data) : [])
      .catch((err) => console.error("Failed to fetch assignments:", err));
  }, [studentId]);

  return (
    <div className="student-assignments-panel">
      <h3>📝 Active Assignments</h3>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((a) => (
            <li key={a._id}>
              <strong>{a.title}</strong> – {a.course?.title}
              <br />
              Due: {new Date(a.dueDate).toLocaleDateString()}
              <br />
              {a.fileUrl ? (
                <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">📎 View Instructions</a>
              ) : (
                "No file attached"
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments available.</p>
      )}
    </div>
  );
};

export default StudentAssignmentsPanel;
