import React from "react";
import AdminDashboard from "../components/Admin/AdminDashboard";

const AdminPage = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // hard reload ensures full reset
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Welcome, Administrator</h2>
        <button onClick={handleLogout} style={styles.button}>
           Logout
        </button>
      </header>
      <AdminDashboard adminName="Administrator" />
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

export default AdminPage;
