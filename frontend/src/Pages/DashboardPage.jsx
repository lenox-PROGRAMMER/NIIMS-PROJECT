import React from "react";
import StudentDashboard from "../components/sections/StudentDashboard";

const DashboardPage = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Welcome, Lenox 🎓</h2>
        <button onClick={handleLogout} style={styles.button}>
          🔓 Logout
        </button>
      </header>
      <StudentDashboard studentName="Lenox" />
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  button: {
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default DashboardPage;
