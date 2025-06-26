import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminPanel.css";

const CourseAssignmentsPanel = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get("/api/enrollments") // You can mock this route
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRecords(data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch course assignments:", err);
      });
  }, []);

  return (
    <div className="admin-panel-wrapper">
      <h3>📚 Student Course & Lecturer Overview</h3>

      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Reg No</th>
            <th>Course</th>
            <th>Lecturer</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((rec, idx) => (
              <tr key={idx}>
                <td>{rec.student.name}</td>
                <td>{rec.student.regNo}</td>
                <td>{rec.course.title}</td>
                <td>{rec.lecturer.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No course assignments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseAssignmentsPanel;
