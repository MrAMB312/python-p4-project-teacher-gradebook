import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function AssignmentList({ assignments, setAssignments }) {

  const assignmentSchema = yup.object().shape({
    category: yup.string().required("Must enter a category").max(50),
    totalPoints: yup
      .number()
      .integer()
      .min(1, "Total points must be positive")
      .required("Must enter total points")
      .typeError("Please enter a valid integer"),
  });

  const formik = useFormik({
    initialValues: { category: "", totalPoints: "" },
    validationSchema: assignmentSchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await fetch("/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: values.category,
          total_points: parseInt(values.totalPoints),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding assignment: " + JSON.stringify(errorData));
        return;
      }

      const newAssignment = await res.json();
      setAssignments([...assignments, newAssignment]);
      resetForm();
    },
  });

  return (
    <div>
      <h2>Assignments</h2>

      <div className="assignments-list">
        {assignments.map((a) => (
          <div key={a.id}>
            {a.category} — {a.total_points} points
          </div>
        ))}
      </div>

      <hr />
      <h3>Add New Assignment</h3>
      <form onSubmit={formik.handleSubmit}>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
          />
        </label>
        <p style={{ color: "red" }}>{formik.errors.category}</p>

        <label>
          Total Points:
          <input
            type="number"
            name="totalPoints"
            value={formik.values.totalPoints}
            onChange={formik.handleChange}
          />
        </label>
        <p style={{ color: "red" }}>{formik.errors.totalPoints}</p>

        <button type="submit">Add Assignment</button>
      </form>
    </div>
  );
}

export default AssignmentList;
