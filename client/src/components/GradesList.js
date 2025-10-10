import React, { useState } from "react";

function GradesList({ match, students, setStudents, assignments }) {
  const studentId = parseInt(match.params.studentId);
  const assignmentId = parseInt(match.params.assignmentId);

  const student = students.find(s => s.id === studentId);
  const assignment = assignments.find(a => a.id === assignmentId);

  const [editScoreId, setEditScoreId] = useState(null);
  const [editScoreValue, setEditScoreValue] = useState("");
  const [newScore, setNewScore] = useState("");

  if (!student || !assignment) return <p>Data not found</p>;

  // Find all grades for this assignment for this student
  const gradesForAssignment = student.assignments.filter(a => a.id === assignment.id);

  const handleEdit = (gradeId) => {
    fetch(`/grades/${gradeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: parseInt(editScoreValue) }),
    })
      .then(res => res.json())
      .then(updated => {
        const updatedStudents = students.map(s => {
          if (s.id === student.id) {
            s.assignments = s.assignments.map(a =>
              a.id === assignment.id && a.id === gradeId
                ? { ...a, grade: updated.score }
                : a
            );
          }
          return s;
        });
        setStudents(updatedStudents);
        setEditScoreId(null);
        setEditScoreValue("");
      });
  };

  const handleDelete = (gradeId) => {
    fetch(`/grades/${gradeId}`, { method: "DELETE" })
      .then(() => {
        const updatedStudents = students.map(s => {
          if (s.id === student.id) {
            s.assignments = s.assignments.filter(a => a.id !== gradeId);
          }
          return s;
        });
        setStudents(updatedStudents);
      });
  };

  const handleAddGrade = () => {
    if (!newScore) return;
    fetch("/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: student.id,
        assignment_id: assignment.id,
        score: parseInt(newScore),
      }),
    })
      .then(res => res.json())
      .then(newGrade => {
        const updatedStudents = students.map(s => {
          if (s.id === student.id) {
            s.assignments.push({
              ...assignment,
              grade: newGrade.score,
              id: newGrade.id,
            });
          }
          return s;
        });
        setStudents(updatedStudents);
        setNewScore("");
      });
  };

  return (
    <div>
      <h3>{assignment.category} Grades for {student.name}</h3>
      <ul>
        {gradesForAssignment.map(g => (
          <li key={g.id}>
            {editScoreId === g.id ? (
              <>
                <input
                  type="number"
                  value={editScoreValue}
                  onChange={e => setEditScoreValue(e.target.value)}
                />
                <button onClick={() => handleEdit(g.id)}>Save</button>
                <button onClick={() => setEditScoreId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {g.grade} / {assignment.total_points} pts
                <button onClick={() => { setEditScoreId(g.id); setEditScoreValue(g.grade); }}>Edit</button>
                <button onClick={() => handleDelete(g.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div>
        <h4>Add a New Grade</h4>
        <input
          type="number"
          placeholder="Score"
          value={newScore}
          onChange={e => setNewScore(e.target.value)}
        />
        <button onClick={handleAddGrade}>Add Grade</button>
      </div>
    </div>
  );
}

export default GradesList;
