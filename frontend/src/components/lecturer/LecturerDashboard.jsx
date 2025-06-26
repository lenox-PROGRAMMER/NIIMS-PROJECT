import React, { useState, useEffect } from "react";
import "../../styles/LecturerDashboard.css";
import axios from "axios";

const LecturerDashboard = ({ lecturerId }) => {
  const [lecturer, setLecturer] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchLecturerInfo();
    fetchCourses();
    fetchAssignedStudents();
  }, []);

  const fetchLecturerInfo = () => {
    axios.get(`/api/lecturers/${lecturerId}`)
      .then((res) => setLecturer(res.data))
      .catch((err) => console.error("❌ Failed to load lecturer info:", err));
  };

  const fetchCourses = () => {
    axios.get(`/api/lecturers/${lecturerId}/courses`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.warn("⚠️ Courses API returned non-array:", data);
          setCourses([]);
        }
      })
      .catch((err) => console.error("❌ Failed to load courses:", err));
  };

  const fetchAssignedStudents = () => {
    axios.get(`/api/lecturers/${lecturerId}/students`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("❌ Failed to load students:", err));
  };

  return (
    <div className="lecturer-dashboard">
      <h2>👋 Welcome, {lecturer?.name || "Lecturer"}!</h2>

      <section className="lecturer-info">
        <h3>📘 Courses You Teach</h3>
        <ul>
          {Array.isArray(courses) && courses.length > 0 ? (
            courses.map((c) => (
              <li key={c._id}>{c.title} — <strong>{c.code}</strong></li>
            ))
          ) : (
            <li>No courses found.</li>
          )}
        </ul>
      </section>

      <section className="lecturer-info">
        <h3>🎓 Assigned Students</h3>
        {Array.isArray(students) && students.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Reg No</th><th>Course</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.regNo}</td>
                  <td>{s.course?.title || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No assigned students yet.</p>
        )}
      </section>

      <section className="lecturer-actions">
        <h3>📌 Next Steps</h3>
        <ul>
          <li>➕ Give an assignment</li>
          <li>📅 Set an exam date</li>
          <li>🗒️ Submit student results</li>
          <li>📝 Write feedback</li>
        </ul>
        <p className="note">We'll modularize these panels next.</p>
      </section>
    </div>
  );
};

export default LecturerDashboard;
