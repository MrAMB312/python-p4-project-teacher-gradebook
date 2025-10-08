import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function StudentGrades({ student, assignments, onEditGrade, onDeleteGrade, onAddGrade }) {
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [addingGradeAssignmentId, setAddingGradeAssignmentId] = useState(null);
  const [newScore, setNewScore] = useState("");

  const editFormik = useFormik({
    initialValues: { score: "" },
    validationSchema: yup.object({ score: yup.number().min(0).required() }),
    onSubmit: (values) => {
      fetch(`/students/${student.id}/grades/${editingGradeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: Number(values.score) }),
      })
        .then((res) => res.json())
        .then((data) => {
          onEditGrade(editingGradeId, data.score);
          setEditingGradeId(null);
        })
        .catch((err) => console.error("Error updating grade:", err));
    },
  });

  const handleAddGrade = (assignmentId, e) => {
    e.preventDefault();
    fetch(`/students/${student.id}/assignments/${assignmentId}/grades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: Number(newScore) }),
    })
      .then((res) => res.json())
      .then((data) => {
        onAddGrade(assignmentId, data);
        setAddingGradeAssignmentId(null);
        setNewScore("");
      })
      .catch((err) => console.error("Error adding grade:", err));
  };

  const groupedGrades = {};
  student.assignments.forEach((assignment) => {
    groupedGrades[assignment.id] = assignment.grades || [];
  });

  return (
    <div>
      <h3>{student.name}’s Grades</h3>
      <ul>
        {assignments.map((assignment) => {
          const gradesForAssignment = groupedGrades[assignment.id] || [];

          return (
            <li key={assignment.id}>
              <strong>{assignment.title}: </strong>
              {gradesForAssignment.length === 0 ? (
                <span>(no grades)</span>
              ) : (
                <ul>
                  {gradesForAssignment.map((g) => (
                    <li key={g.id}>
                      {editingGradeId === g.id ? (
                        <form onSubmit={editFormik.handleSubmit}>
                          <input
                            name="score"
                            type="number"
                            value={editFormik.values.score}
                            onChange={editFormik.handleChange}
                          />
                          <button type="submit">Save</button>
                          <button type="button" onClick={() => setEditingGradeId(null)}>
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          {g.score}{" "}
                          <button
                            onClick={() => {
                              setEditingGradeId(g.id);
                              editFormik.setFieldValue("score", g.score);
                            }}
                          >
                            Edit
                          </button>
                          <button onClick={() => onDeleteGrade(student.id, g.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {addingGradeAssignmentId === assignment.id ? (
                <form onSubmit={(e) => handleAddGrade(assignment.id, e)}>
                  <input
                    type="number"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                  />
                  <button type="submit">Add</button>
                  <button type="button" onClick={() => setAddingGradeAssignmentId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <button onClick={() => setAddingGradeAssignmentId(assignment.id)}>
                  Add Grade
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StudentGrades;
