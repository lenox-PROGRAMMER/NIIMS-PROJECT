import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", form); // proxy assumed set via Vite
      const { token, role, userId } = res.data;

      // 🔐 Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // 🚀 Apply token to axios globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 🧭 Navigate based on role
      if (role === "admin") navigate("/admin");
      else if (role === "lecturer") navigate("/lecturer/dashboard");
      else if (role === "student") navigate("/student/dashboard");
      else navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Login failed";
      setError(msg);
      console.error("Login Error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    if (token && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "lecturer") navigate("/lecturer/dashboard");
      else if (role === "student") navigate("/student/dashboard");
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>🔐 Login to NIIMS</h2>

        <input
          type="text"
          name="identifier"
          placeholder="Email or ID"
          value={form.identifier}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          🚀 Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "320px",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  select: {
    padding: "0.7rem",
    borderRadius: "4px",
    fontSize: "1rem",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    padding: "0.75rem",
    cursor: "pointer",
  },
  error: {
    color: "crimson",
    fontWeight: "600",
    textAlign: "center",
  },
};

export default Login;
