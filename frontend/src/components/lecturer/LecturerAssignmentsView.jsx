import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/LecturerAssignmentsView.css";

const LecturerAssignmentsView = ({ lecturerId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get(`/api/lecturers/${lecturerId}/courses`)
      .then(res => Array.isArray(res.data) ? setCourses(res.data) : [])
      .catch(err => console.error("❌ Failed to load courses:", err));
  }, [lecturerId]);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/api/lecturers/${lecturerId}/courses/${selectedCourse}/assignments`)
        .then(res => Array.isArray(res.data) ? setAssignments(res.data) : [])
        .catch(err => console.error("❌ Failed to load assignments:", err));
    }
  }, [lecturerId, selectedCourse]);

  return (
    <div className="assignments-view">
      <h3>📬 Assignment Submissions</h3>

      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>

      {assignments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Submitted At</th>
              <th>File</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id}>
                <td>{a.student?.name || "Unknown"}</td>
                <td>{new Date(a.submittedAt).toLocaleString()}</td>
                <td>
                  {a.fileUrl ? (
                    <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">📎 View</a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{a.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedCourse ? (
        <p>No assignments submitted for this course.</p>
      ) : null}
    </div>
  );
};

export default LecturerAssignmentsView;
