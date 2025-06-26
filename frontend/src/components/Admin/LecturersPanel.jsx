import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminPanel.css";

const LecturersPanel = () => {
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    workNumber: "",
    department: "",
    courseId: ""
  });

  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("crimson");

  useEffect(() => {
    fetchLecturers();
    fetchCourses();
  }, []);

  const fetchLecturers = () => {
    axios.get("/api/lecturers")
      .then((res) => {
        setLecturers(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch lecturers:", err);
        setLecturers([]);
        setMessage("⚠️ Could not load lecturers.");
        setMsgColor("crimson");
      });
  };

  const fetchCourses = () => {
    axios.get("/api/courses")
      .then((res) => {
        setCourses(Array.isArray(res.data) ? res.data : res.data.courses || []);
      })
      .catch((err) => {
        console.error("❌ Failed to load courses:", err);
        setCourses([]);
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, password, workNumber, department, courseId } = form;
    if (!name || !email || !password || !workNumber || !department || !courseId) {
      setMessage("⚠️ Please fill in all fields.");
      setMsgColor("crimson");
      return;
    }

    try {
      const res = await axios.post("/api/lecturers/register", form);
      setLecturers((prev) => [...prev, res.data]);
      setForm({
        name: "",
        email: "",
        password: "",
        workNumber: "",
        department: "",
        courseId: ""
      });
      setMessage("✅ Lecturer registered successfully.");
      setMsgColor("green");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setMessage(err.response?.data?.message || "❌ Error during lecturer registration.");
      setMsgColor("crimson");
    }
  };

  const deleteLecturer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lecturer?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/lecturers/${id}`);
      setLecturers((prev) => prev.filter((l) => l.id !== id));
      setMessage("🗑️ Lecturer deleted.");
      setMsgColor("green");
    } catch (err) {
      console.error("❌ Failed to delete lecturer:", err);
      setMessage("❌ Could not delete lecturer.");
      setMsgColor("crimson");
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <h3>👨🏽‍🏫 Lecturer Management</h3>
      <p>Total Lecturers: <strong>{lecturers.length}</strong></p>
      {message && (
        <p className="feedback" style={{ color: msgColor }}>
          {message}
        </p>
      )}

      <div className="student-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input name="workNumber" placeholder="Work No." value={form.workNumber} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />

        <select name="courseId" value={form.courseId} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <button onClick={handleSubmit}>➕ Register Lecturer</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Work No.</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.length > 0 ? (
            lecturers.map((l) => (
              <tr key={l.id || l.workNumber}>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>{l.workNumber}</td>
                <td>
                  <button onClick={() => deleteLecturer(l.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No lecturers found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LecturersPanel;
