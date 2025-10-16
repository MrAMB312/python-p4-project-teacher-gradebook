import React from "react";
import { Link } from "react-router-dom";
import GradeForm from "./GradeForm";

function StudentAssignments({ match, students, setStudents, assignments, setAssignments }) {
  const studentId = parseInt(match.params.studentId);
  const student = students.find((s) => s.id === studentId);

  if (!student) return <p>Student not found</p>;

  // Update student state when a grade is added
  const handleAddGrade = (assignment, newGrade) => {
    const updatedStudents = students.map((s) => {
      if (s.id === student.id) {
        const existingAssignment = s.assignments.find(a => a.id === assignment.id);

        if (existingAssignment) {
          existingAssignment.grades = existingAssignment.grades || [];
          existingAssignment.grades.push(newGrade);
        } else {
          // New assignment
          s.assignments = [...s.assignments, { ...assignment, grades: [newGrade] }];
        }
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  return (
    <div>
      <h2>{student.name}'s Assignments</h2>

      {student.assignments.length > 0 ? (
        <ul>
          {student.assignments.map((assignment) => (
              <li key={assignment.id}>
                <Link to={`/students/${student.id}/assignments/${assignment.id}`}>
                  {assignment.category}
                </Link>
              </li>
            ))
          }
        </ul>
      ) : (
        <p>No assignments found.</p>
      )}

      <hr />
      <h3>Add a Grade</h3>

      <GradeForm
        studentId={student.id}
        assignments={assignments}
        onAddGrade={handleAddGrade}
        setAssignments={setAssignments}
      />
    </div>
  );
}

export default StudentAssignments;
