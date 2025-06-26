// src/components/Sidebar.jsx
import React from "react";
import { FaHome, FaCoins, FaBook, FaCog, FaCalendarAlt, FaEnvelope, FaUpload, FaGithub } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ onNavSelect }) => {
  const navItems = [
    { label: "Available Hostels", icon: <FaHome />, key: "hostels" },
    { label: "Fee Balance", icon: <FaCoins />, key: "fees" },
    { label: "Course Enrollment", icon: <FaBook />, key: "courses" },
    { label: "Settings", icon: <FaCog />, key: "settings" },
    { label: "Exam Timetable", icon: <FaCalendarAlt />, key: "timetable" },
    { label: "Messages", icon: <FaEnvelope />, key: "messages" },
    { label: " View Assignments", key: "viewassignments" },
    { label: "📝 Assignments", key: "assignments" },
{ label: "📅 Exams", key: "exams" },

    { label: "Submit Assignment", icon: <FaUpload />, key: "submit" },
    { label: "GitHub Repo", icon: <FaGithub />, key: "github" }
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">NIIMS</h2>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.key} onClick={() => onNavSelect(item.key)}>
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
