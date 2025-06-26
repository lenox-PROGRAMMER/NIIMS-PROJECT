import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminPanel.css";

const HostelsPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchStudents();
  }, []);

  const fetchRooms = () => {
    axios
      .get("/api/rooms")
      .then((res) => setRooms(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("❌ Failed to fetch rooms:", err));
  };

  const fetchStudents = () => {
    axios
      .get("/api/students?status=feesCleared")
      .then((res) => setStudents(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("❌ Failed to fetch students:", err));
  };

  const handleLockToggle = (roomId, currentStatus) => {
    const action = currentStatus === "locked" ? "unlock" : "lock";
    axios
      .patch(`/api/rooms/${roomId}/${action}`)
      .then(fetchRooms)
      .catch((err) => console.error(`❌ Failed to ${action} room:`, err));
  };

  const handleAssignRoom = () => {
    if (!selectedStudent || !selectedRoom) return;
    axios
      .post(`/api/rooms/assign`, {
        roomId: selectedRoom,
        studentId: selectedStudent,
      })
      .then(() => {
        alert("✅ Room assigned!");
        setSelectedStudent("");
        setSelectedRoom("");
        fetchRooms();
      })
      .catch((err) => console.error("❌ Failed to assign room:", err));
  };

  return (
    <div className="admin-panel-wrapper">
      <h3>🏨 Hostel Room Management</h3>

      <section className="student-form">
        <h4>Assign Room to Student (Fees Cleared)</h4>

        <label htmlFor="student-select" className="sr-only">
          Select Student
        </label>
        <select
          id="student-select"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.regNo})
            </option>
          ))}
        </select>

        <label htmlFor="room-select" className="sr-only">
          Select Available Room
        </label>
        <select
          id="room-select"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <option value="">-- Select Available Room --</option>
          {rooms
            .filter((r) => r.status === "available")
            .map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.capacity} beds)
              </option>
            ))}
        </select>

        <button
          onClick={handleAssignRoom}
          disabled={!selectedStudent || !selectedRoom}
          aria-disabled={!selectedStudent || !selectedRoom}
        >
          Assign Room
        </button>
      </section>

      <h4>Room Inventory</h4>
      <table className="hostels-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Status</th>
            <th>Capacity</th>
            <th>Assigned To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.name}</td>
              <td>{room.status}</td>
              <td>{room.capacity}</td>
              <td>
                {room.occupant
                  ? `${room.occupant.name} (${room.occupant.regNo})`
                  : "—"}
              </td>
              <td>
                <button onClick={() => handleLockToggle(room._id, room.status)}>
                  {room.status === "locked" ? "Unlock" : "Lock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HostelsPanel;
