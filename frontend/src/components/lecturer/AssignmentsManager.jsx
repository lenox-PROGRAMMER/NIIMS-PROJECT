import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AssignmentsManager.css";

const AssignmentsManager = ({ lecturerId }) => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: ""
  });

  useEffect(() => {
    axios.get(`/api/lecturers/${lecturerId}/courses`)
      .then((res) => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to load courses:", err));
  }, [lecturerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.dueDate || !form.courseId) return;

    axios.post("/api/assignments", {
      ...form,
      lecturerId
    })
    .then(() => {
      alert("✅ Assignment created!");
      setForm({ title: "", description: "", dueDate: "", courseId: "" });
    })
    .catch((err) => console.error("❌ Failed to create assignment:", err));
  };

  return (
    <div className="assignment-panel">
      <h3>📝 Give Assignment</h3>

      <div className="assignment-form">
        <input
          name="title"
          placeholder="Assignment Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        <select name="courseId" value={form.courseId} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>

        <button onClick={handleSubmit}>Create Assignment</button>
      </div>
    </div>
  );
};

export default AssignmentsManager;
