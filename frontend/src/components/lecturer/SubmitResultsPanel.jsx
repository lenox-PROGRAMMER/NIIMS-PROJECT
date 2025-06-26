import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/SubmitResultsPanel.css";

const SubmitResultsPanel = ({ lecturerId }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [results, setResults] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`/api/lecturers/${lecturerId}/courses`)
      .then((res) => {
        Array.isArray(res.data) ? setCourses(res.data) : setCourses([]);
      })
      .catch((err) => console.error("❌ Failed to fetch courses:", err));
  }, [lecturerId]);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/api/courses/${selectedCourse}/students`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setStudents(res.data);
            const init = {};
            res.data.forEach((s) => {
              init[s._id] = { score: "", feedback: "" };
            });
            setResults(init);
          } else {
            setStudents([]);
          }
        })
        .catch((err) => {
          console.error("❌ Failed to fetch students:", err);
          setStudents([]);
        });
    }
  }, [selectedCourse]);

  const handleInputChange = (id, field, value) => {
    setResults((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const allScoresFilled = Object.values(results).every((r) => r.score !== "");

  const handleSubmit = () => {
    if (!allScoresFilled) {
      alert("⚠️ Please enter a score for all students.");
      return;
    }

    setIsSubmitting(true);

    axios.post("/api/exams/results", {
      courseId: selectedCourse,
      lecturerId,
      studentResults: Object.entries(results).map(([studentId, { score, feedback }]) => ({
        studentId,
        score,
        feedback
      }))
    })
      .then(() => {
        alert("✅ Results submitted!");
        setResults({});
        setStudents([]);
        setSelectedCourse("");
      })
      .catch((err) => console.error("❌ Failed to submit results:", err))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="results-panel">
      <h3>🗒️ Submit Exam Results</h3>

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="course-select"
      >
        <option value="">Select Course</option>
        {Array.isArray(courses) && courses.map((c) => (
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>

      {Array.isArray(students) && students.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Student</th><th>Score</th><th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>
                    <input
                      type="number"
                      value={results[s._id]?.score || ""}
                      onChange={(e) => handleInputChange(s._id, "score", e.target.value)}
                      placeholder="Score"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={results[s._id]?.feedback || ""}
                      onChange={(e) => handleInputChange(s._id, "feedback", e.target.value)}
                      placeholder="Feedback (optional)"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={!allScoresFilled || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Results"}
          </button>
        </>
      ) : selectedCourse ? (
        <p>No students found for this course.</p>
      ) : null}
    </div>
  );
};

export default SubmitResultsPanel;
