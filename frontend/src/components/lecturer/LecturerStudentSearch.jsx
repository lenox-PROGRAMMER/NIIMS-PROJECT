import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/LecturerStudentSearch.css";

const LecturerStudentSearch = ({ lecturerId }) => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios
      .get(`/api/lecturers/${lecturerId}/students`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else {
          console.warn("⚠️ Students API response is not an array:", res.data);
          setStudents([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch students:", err);
        setStudents([]);
      });
  }, [lecturerId]);

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(query.toLowerCase()) ||
      s.regNo?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="student-search-panel">
      <h3>🎓 Your Students ({students.length})</h3>
      <input
        type="text"
        placeholder="Search by name or Reg No"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg No</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.regNo}</td>
                <td>{s.course?.title || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students match your search.</p>
      )}
    </div>
  );
};

export default LecturerStudentSearch;
