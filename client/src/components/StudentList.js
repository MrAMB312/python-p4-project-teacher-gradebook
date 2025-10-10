import React, { useState } from "react";
import { Link } from "react-router-dom";

function StudentList({ students, setStudents }) {
  const [name, setName] = useState("");

  const handleAddStudent = (e) => {
    e.preventDefault();
    fetch("/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then(res => res.json())
      .then(newStudent => {
        setStudents([...students, { ...newStudent, assignments: [] }]);
        setName("");
      });
  };

  return (
    <div>
      <h2>Students</h2>

      {/* Add Student Form */}
      <form onSubmit={handleAddStudent}>
        <input
          placeholder="Student Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>

      {/* Student List as Links */}
      <ul>
        {students.map(s => (
          <li key={s.id}>
            <Link to={`/students/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;
