import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function GradeForm({ studentId, assignments = [], onAddGrade, setAssignments, fixedAssignment = null }) {
  const [mode, setMode] = useState(fixedAssignment ? "fixed" : null)

  const formik = useFormik({
    initialValues: {
      assignmentId: fixedAssignment ? fixedAssignment.id : "",
      category: fixedAssignment ? fixedAssignment.category : "",
      totalPoints: fixedAssignment ? fixedAssignment.total_points : "",
      title: "",
      score: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Must enter a title").max(50),
      score: yup
        .number()
        .integer("Must be an integer")
        .min(0, "Score must be >= 0")
        .required("Must enter a score"),
      assignmentId: yup.number().when("mode", {
        is: (m) => m !== "fixed" && m === "existing",
        then: yup.number().required("Must select an assignment"),
      }),
      category: yup.string().when("mode", {
        is: (m) => m !== "fixed" && m === "new",
        then: yup.string().required("Must enter a category").max(50),
      }),
      totalPoints: yup.number().when("mode", {
        is: (m) => m !== "fixed" && m === "new",
        then: yup.number().integer().positive().required("Must enter total points"),
      }),
    }),
    onSubmit: async (values) => {
      let assignment;

      if (fixedAssignment) {
        // Use the assignment passed from GradesList
        assignment = fixedAssignment;
      } else if (mode === "existing") {
        assignment = assignments.find(a => a.id === parseInt(values.assignmentId));
      } else if (mode === "new") {
        const res = await fetch("/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: values.category,
            total_points: parseInt(values.totalPoints),
          }),
        });
        assignment = await res.json();
        if (setAssignments) setAssignments([...assignments, assignment]);
      }

      const resGrade = await fetch("/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          assignment_id: assignment.id,
          score: parseInt(values.score),
          title: values.title,
        }),
      });
      const newGrade = await resGrade.json();
      onAddGrade(assignment, newGrade);

      formik.resetForm();
      if (!fixedAssignment) setMode(null);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Only show assignment creation options when NOT fixed */}
      {!fixedAssignment && !mode && (
        <div>
          <button type="button" onClick={() => setMode("existing")}>
            Select Existing Assignment
          </button>
          <button type="button" onClick={() => setMode("new")}>
            Create New Assignment
          </button>
        </div>
      )}

      {!fixedAssignment && mode === "existing" && (
        <label>
          Assignment:
          <select
            name="assignmentId"
            value={formik.values.assignmentId}
            onChange={formik.handleChange}
          >
            <option value="">--Select Assignment--</option>
            {assignments.map(a => (
              <option key={a.id} value={a.id}>
                {a.category} ({a.total_points} pts)
              </option>
            ))}
          </select>
          {formik.errors.assignmentId && <p style={{ color: "red" }}>{formik.errors.assignmentId}</p>}
        </label>
      )}

      {!fixedAssignment && mode === "new" && (
        <>
          <label>
            Category:
            <input
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
            />
            {formik.errors.category && <p style={{ color: "red" }}>{formik.errors.category}</p>}
          </label>
          <label>
            Total Points:
            <input
              type="number"
              name="totalPoints"
              value={formik.values.totalPoints}
              onChange={formik.handleChange}
            />
            {formik.errors.totalPoints && <p style={{ color: "red" }}>{formik.errors.totalPoints}</p>}
          </label>
        </>
      )}

      {/* Always show title/score inputs */}
      {(mode || fixedAssignment) && (
        <>
          <label>
            Title:
            <input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.errors.title && <p style={{ color: "red" }}>{formik.errors.title}</p>}
          </label>
          <label>
            Score:
            <input
              type="number"
              name="score"
              value={formik.values.score}
              onChange={formik.handleChange}
            />
            {formik.errors.score && <p style={{ color: "red" }}>{formik.errors.score}</p>}
          </label>
          <button type="submit">Add Grade</button>
        </>
      )}
    </form>
  );
}

export default GradeForm;