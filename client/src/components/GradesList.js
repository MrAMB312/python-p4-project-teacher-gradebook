import React, { useState } from "react";
import GradeForm from "./GradeForm";

function GradesList({ match, students, setStudents }) {
  const [editScoreId, setEditScoreId] = useState(null);
  const [editScoreValue, setEditScoreValue] = useState("");

  const studentId = parseInt(match.params.studentId);
  const category = match.params.assignmentId; // category from route

  const student = students.find((s) => s.id === studentId);
  if (!student) return <p>Student not found</p>;

  // Only show assignments for this category
  const assignmentsInCategory = (student.assignments || []).filter(
    (a) => a.category === category
  );

  // Pick first assignment for fixedAssignment (you can adjust if needed)
  const fixedAssignment = assignmentsInCategory[0] || null;

  const handleEdit = (gradeId, assignmentId) => {
    fetch(`/grades/${gradeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: parseInt(editScoreValue) }),
    })
      .then((res) => res.json())
      .then((updated) => {
        const updatedStudents = students.map((s) => {
          if (s.id === student.id) {
            s.assignments = s.assignments.map((a) => {
              if (a.id === assignmentId) {
                a.grades = a.grades.map((g) =>
                  g.id === gradeId ? { ...g, score: updated.score } : g
                );
              }
              return a;
            });
          }
          return s;
        });
        setStudents(updatedStudents);
        setEditScoreId(null);
        setEditScoreValue("");
      });
  };

  const handleDelete = (gradeId, assignmentId) => {
    fetch(`/grades/${gradeId}`, { method: "DELETE" }).then(() => {
      const updatedStudents = students.map((s) => {
        if (s.id === student.id) {
          s.assignments = s.assignments.map((a) => {
            if (a.id === assignmentId) {
              a.grades = a.grades.filter((g) => g.id !== gradeId);
            }
            return a;
          });
        }
        return s;
      });
      setStudents(updatedStudents);
    });
  };

  const handleAddGrade = (assignment, newGrade) => {
    const updatedStudents = students.map((s) => {
      if (s.id === student.id) {
        s.assignments = s.assignments.map((a) => {
          if (a.id === assignment.id) {
            a.grades = a.grades || [];
            a.grades.push(newGrade);
          }
          return a;
        });
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  return (
    <div>
      <h3>
        {category.charAt(0).toUpperCase() + category.slice(1)} Grades for {student.name}
      </h3>

      {assignmentsInCategory.map((assignment) => (
        <div key={assignment.id}>
          <ul>
            {(assignment.grades || []).map((g) => (
              <li key={g.id}>
                {editScoreId === g.id ? (
                  <>
                    <input
                      type="number"
                      value={editScoreValue}
                      onChange={(e) => setEditScoreValue(e.target.value)}
                    />
                    <button onClick={() => handleEdit(g.id, assignment.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditScoreId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div>{g.title}</div>
                    <div>
                      {g.score} / {assignment.total_points} pts
                    </div>
                    <button
                      onClick={() => {
                        setEditScoreId(g.id);
                        setEditScoreValue(g.score);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(g.id, assignment.id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <hr />
      <h3>Add a Grade</h3>

      {fixedAssignment ? (
        <GradeForm
          studentId={student.id}
          fixedAssignment={fixedAssignment}
          onAddGrade={handleAddGrade}
        />
      ) : (
        <p>No assignment found for this category.</p>
      )}
    </div>
  );
}

export default GradesList;
