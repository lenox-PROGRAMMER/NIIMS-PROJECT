import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/StudentsPanel.css";

const StudentsPanel = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [paymentModal, setPaymentModal] = useState({ show: false, student: null });
  const [paymentForm, setPaymentForm] = useState({ paymentMode: "", paymentRef: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    regNo: "",
    password: "",
    courseId: "",
    lecturerId: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState({
    data: false,
    submitting: false,
    lecturers: false,
  });

  const injectToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  const fetchStudents = async () => {
    setLoading((prev) => ({ ...prev, data: true }));
    try {
      injectToken();
      const res = await axios.get("/api/students");
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      console.error("❌ Failed to load students:", err);
      setStudents([]);
      setFiltered([]);
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  };

  const fetchCourses = async () => {
    try {
      injectToken();
      const res = await axios.get("/api/courses");
      const data = res.data;
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch (err) {
      console.warn("⚠️ Could not fetch courses.");
    }
  };

  const fetchLecturersByCourse = async (courseId) => {
    if (!courseId) return setLecturers([]);
    setLoading((prev) => ({ ...prev, lecturers: true }));
    try {
      injectToken();
      const res = await axios.get(`/api/courses/${courseId}/lecturers`);
      setLecturers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch lecturers:", err);
      setLecturers([]);
    } finally {
      setLoading((prev) => ({ ...prev, lecturers: false }));
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (form.courseId) {
      fetchLecturersByCourse(form.courseId);
    }
  }, [form.courseId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredList = students.filter((s) =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.regNo?.toLowerCase().includes(term) ||
      s.courseTitle?.toLowerCase().includes(term) ||
      s.lecturerName?.toLowerCase().includes(term)
    );
    setFiltered(filteredList);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;
    try {
      injectToken();
      await axios.delete(`/api/students/${id}`);
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      setFiltered(updated);
      setMessage("🗑️ Student deleted successfully.");
    } catch (err) {
      console.error("❌ Failed to delete student:", err);
      setMessage("❌ Error deleting student.");
    }
  };

  const handleSubmit = async () => {
    const { name, email, regNo, password, courseId, lecturerId } = form;
    if (!name || !email || !regNo || !password || !courseId || !lecturerId) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setLoading((prev) => ({ ...prev, submitting: true }));
    setMessage("");

    try {
      injectToken();
      const res = await axios.post("/api/students/register", form);
      const newStudent = res.data;
      const updated = [...students, newStudent];
      setStudents(updated);
      setFiltered(updated);
      setForm({
        name: "",
        email: "",
        regNo: "",
        password: "",
        courseId: "",
        lecturerId: "",
      });
      setMessage("✅ Student registered successfully.");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setMessage(
        err.response?.data?.message || "❌ Error registering student."
      );
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleOpenPayment = (student) => {
    setPaymentModal({ show: true, student });
    setPaymentForm({ paymentMode: "", paymentRef: "" });
  };

  const handleConfirmPayment = async () => {
    const { paymentMode, paymentRef } = paymentForm;
    if (!paymentMode || !paymentRef) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      injectToken();
      await axios.patch(`/api/students/${paymentModal.student.id}/clear-fees`, {
        paymentMode,
        paymentRef,
      });
      alert("✅ Payment verified!");
      setPaymentModal({ show: false, student: null });
      fetchStudents();
    } catch (err) {
      console.error("❌ Payment update failed:", err);
      alert("Could not clear fees.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>🎓 Students Panel</h3>

      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "crimson" }}>
          {message}
        </p>
      )}

      {paymentModal.show && (
        <div className="payment-modal">
          <h4>Confirm Payment for {paymentModal.student.name}</h4>
          <select
            value={paymentForm.paymentMode}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, paymentMode: e.target.value })
            }
          >
            <option value="">Select Payment Mode</option>
            <option value="Mpesa">Mpesa</option>
            <option value="Bank">Bank</option>
            <option value="Cash">Cash</option>
          </select>
          <input
            type="text"
            placeholder="Transaction Ref"
            value={paymentForm.paymentRef}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, paymentRef: e.target.value })
            }
          />
          <button onClick={handleConfirmPayment}>✅ Confirm</button>
          <button onClick={() => setPaymentModal({ show: false, student: null })}>❌ Cancel</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", maxWidth: "500px", gap: "0.5rem", marginBottom: "2rem" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="regNo" placeholder="Reg No." value={form.regNo} onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />

        <select name="courseId" value={form.courseId} onChange={handleChange}>
          <option value="">{courses.length === 0 ? "Loading courses..." : "Select Course"}</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <select name="lecturerId" value={form.lecturerId} onChange={handleChange}>
          <option value="">{loading.lecturers ? "Loading lecturers..." : "Select Lecturer"}</option>
          {lecturers.map((l) => (
            <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
          ))}
        </select>

        <button onClick={handleSubmit} disabled={loading.submitting}>
          {loading.submitting ? "⏳ Registering..." : "➕ Register Student"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, reg no, course, or lecturer"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "1rem", width: "100%", maxWidth: "400px" }}
      />

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Reg No.</th>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Fees</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8">No students match your search.</td>
            </tr>
          ) : (
            filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.regNo}</td>
                <td>{s.courseTitle || "—"}</td>
                <td>{s.lecturerName || "—"}</td>
                <td>{s.feesCleared ? "✅ Cleared" : "❌ Pending"}</td>
                <td>{s.paymentMode ? `${s.paymentMode} - ${s.paymentRef}` : "—"}</td>
                <td>
                  {!s.feesCleared && (
                    <button onClick={() => handleOpenPayment(s)}>💸 Confirm</button>
                  )}
                  <button onClick={() => handleDelete(s.id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPanel;
