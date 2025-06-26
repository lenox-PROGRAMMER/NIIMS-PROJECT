import React from "react";
import "../../styles/AdminSidebar.css";

const AdminSidebar = ({ onSelect, activeKey, onClose }) => {
  const navItems = [
    { label: "🏠 Dashboard", key: "dashboard" },
    { label: "📥 Submissions", key: "submissions" },
    { label: "🎓 Manage Students", key: "students" },
    { label: "👨🏽‍🏫 Manage Lecturers", key: "lecturers" },
    { label: "🧩 Assign Students", key: "assignments" },
    { label: "📚 View Assignments", key: "courseAssignments" },
    { label: "🏨 Hostel Bookings", key: "hostels" },
    { label: "👥 Manage Users", key: "users" }
  ];

  const handleSelect = (key) => {
    onSelect(key);
    if (onClose) onClose(); // Auto-close sidebar on mobile
  };

  return (
    <aside className="admin-sidebar" role="navigation" aria-label="Admin Sidebar">
      <h3 className="admin-logo">Admin • NIIMS</h3>
      <ul className="admin-nav">
        {navItems.map((item) => (
          <li
            key={item.key}
            role="button"
            tabIndex={0}
            aria-selected={item.key === activeKey}
            className={item.key === activeKey ? "active" : ""}
            onClick={() => handleSelect(item.key)}
            onKeyDown={(e) => e.key === "Enter" && handleSelect(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
