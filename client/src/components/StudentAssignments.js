import React, { useState } from "react";
import { Link } from "react-router-dom";

function StudentAssignments({ match, students, setStudents, assignments, setAssignments }) {
  const studentId = parseInt(match.params.studentId);
  const student = students.find(s => s.id === studentId);

  const [newAssignmentId, setNewAssignmentId] = useState("");
  const [newAssignmentCategory, setNewAssignmentCategory] = useState("");
  const [newScore, setNewScore] = useState("");

  if (!student) return <p>Student not found</p>;

  const handleAddGrade = (e) => {
    e.preventDefault();

    let assignmentIdToUse = newAssignmentId;

    // If teacher entered a new assignment category
    if (newAssignmentCategory.trim()) {
      fetch("/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAssignmentCategory, // simple MVP: title = category
          category: newAssignmentCategory,
          total_points: 1 // default points; can be edited later
        }),
      })
        .then(res => res.json())
        .then(newAssignment => {
          // Add new assignment to global assignments
          setAssignments([...assignments, newAssignment]);
          assignmentIdToUse = newAssignment.id;

          // Add grade for student
          addGradeToStudent(assignmentIdToUse);
        });
    } else {
      addGradeToStudent(assignmentIdToUse);
    }
  };

  const addGradeToStudent = (assignmentIdToUse) => {
    fetch("/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: student.id,
        assignment_id: parseInt(assignmentIdToUse),
        score: parseInt(newScore)
      })
    })
      .then(res => res.json())
      .then(newGrade => {
        const updatedStudents = students.map(s => {
          if (s.id === student.id) {
            const assignment = assignments.find(a => a.id === parseInt(assignmentIdToUse)) || { id: parseInt(assignmentIdToUse), category: newAssignmentCategory };
            s.assignments.push({
              ...assignment,
              grade: newGrade.score,
              id: newGrade.id,
            });
          }
          return s;
        });
        setStudents(updatedStudents);
        setNewAssignmentId("");
        setNewAssignmentCategory("");
        setNewScore("");
      });
  };

  return (
    <div>
      <h2>{student.name}'s Assignments</h2>
      <ul>
        {student.assignments.map((a) => (
          <li key={a.id}>
            <Link to={`/students/${studentId}/assignments/${a.id}`}>
              {a.category}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Add Grade</h3>
      <form onSubmit={handleAddGrade}>
        <select value={newAssignmentId} onChange={e => setNewAssignmentId(e.target.value)}>
          <option value="">Select Assignment</option>
          {assignments.map(a => (
            <option key={a.id} value={a.id}>{a.category}</option>
          ))}
        </select>
        <span> or add new category: </span>
        <input
          type="text"
          placeholder="New Assignment Category"
          value={newAssignmentCategory}
          onChange={e => setNewAssignmentCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Score"
          value={newScore}
          onChange={e => setNewScore(e.target.value)}
          required
        />
        <button type="submit">Add Grade</button>
      </form>
    </div>
  );
}

export default StudentAssignments;
