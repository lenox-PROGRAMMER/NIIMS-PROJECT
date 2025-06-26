import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/StudentExamSchedule.css";


const StudentExamSchedule = ({ studentId }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/students/${studentId}/exams`)
      .then((res) => Array.isArray(res.data) ? setExams(res.data) : [])
      .catch((err) => console.error("Failed to fetch exams:", err));
  }, [studentId]);

  return (
    <div className="student-exams-panel">
      <h3>📅 Upcoming Exams</h3>
      {exams.length > 0 ? (
        <ul>
          {exams.map((exam) => (
            <li key={exam._id}>
              <strong>{exam.course?.title}</strong> – {exam.topic || "General"}
              <br />
              {new Date(exam.examDate).toLocaleString()} @ {exam.location || "TBA"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming exams scheduled.</p>
      )}
    </div>
  );
};

export default StudentExamSchedule;
