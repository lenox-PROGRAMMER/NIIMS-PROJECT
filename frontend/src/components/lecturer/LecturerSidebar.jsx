import React from "react";
import "../../styles/LecturerSidebar.css";

const LecturerSidebar = ({ onSelect }) => {
  const navItems = [
    { label: "🏠 Dashboard", key: "dashboard" },
    { label: "📝 Assignments", key: "assignments" },
    { label: "📅 Exams", key: "exams" },
    { label: "👀 Student Tracker", key: "students" }, // ← ✅ comma added here
    { label: "🗒️ Results", key: "results" }
  ];

  return (
    <aside className="lecturer-sidebar">
      <h3 className="lecturer-logo">Lecturer • NIIMS</h3>
      <ul className="lecturer-nav">
        {navItems.map((item) => (
          <li key={item.key} onClick={() => onSelect(item.key)}>
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LecturerSidebar;
