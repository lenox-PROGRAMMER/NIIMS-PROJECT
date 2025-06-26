import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminPanel.css";

const AssignmentsPanel = () => {
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    axios.get("/api/lecturers")
      .then((res) => setLecturers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(" Failed to fetch lecturers:", err));

    axios.get("/api/students")
      .then((res) => setStudents(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(" Failed to fetch students:", err));
  }, []);

  const handleAssignment = () => {
    if (!selectedLecturer || selectedStudents.length === 0) return;

    axios.post("/api/assignments", {
      lecturerId: selectedLecturer,
      studentIds: selectedStudents,
    })
    .then(() => {
      alert("✅ Students successfully assigned!");
      setSelectedLecturer("");
      setSelectedStudents([]);
    })
    .catch((err) => {
      console.error("Assignment failed:", err);
    });
  };

  const handleStudentToggle = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <h3>🧩 Assign Students to Lecturers</h3>

      <div className="student-form">
        <label>
          Select Lecturer:
          <select
            value={selectedLecturer}
            onChange={(e) => setSelectedLecturer(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {lecturers.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name} ({l.staffNo})
              </option>
            ))}
          </select>
        </label>
      </div>

      <h4>Select Students:</h4>
      <div className="assign-student-list">
        {students.map((s) => (
          <label key={s._id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedStudents.includes(s._id)}
              onChange={() => handleStudentToggle(s._id)}
            />
            {s.name} ({s.regNo})
          </label>
        ))}
      </div>

      <button onClick={handleAssignment} style={{ marginTop: "1rem" }}>
        Assign Selected Students
      </button>
    </div>
  );
};

export default AssignmentsPanel;
