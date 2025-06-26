import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ExamScheduler.css";

const ExamScheduler = ({ lecturerId }) => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: "", examDate: "" });

  useEffect(() => {
    axios.get(`/api/lecturers/${lecturerId}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("❌ Failed to load courses:", err));
  }, [lecturerId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.courseId || !form.examDate) return;
    axios.post("/api/exams", { ...form, lecturerId })
      .then(() => {
        alert("✅ Exam scheduled!");
        setForm({ courseId: "", examDate: "" });
      })
      .catch((err) => console.error("❌ Failed to schedule exam:", err));
  };

  return (
    <div className="exam-scheduler">
      <h3>📅 Schedule Exam</h3>
      <select name="courseId" value={form.courseId} onChange={handleChange}>
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>
      <input
        type="datetime-local"
        name="examDate"
        value={form.examDate}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Schedule Exam</button>
    </div>
  );
};

export default ExamScheduler;
