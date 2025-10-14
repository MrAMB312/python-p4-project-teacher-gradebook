import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";

function StudentList({ students, setStudents }) {
  
  const studentSchema = yup.object().shape({
    name: yup.string().required("Must enter a name").max(50, "Name is too long"),
  });

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: studentSchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await fetch("/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding student: " + JSON.stringify(errorData));
        return;
      }

      const newStudent = await res.json();
      setStudents([...students, { ...newStudent, assignments: [] }]);
      resetForm();
    },
  });

  return (
    <div>
      <h2>Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <Link to={`/students/${student.id}`}>{student.name}</Link>
          </li>
        ))}
      </ul>

      <hr />
      <h3>Add New Student</h3>
      <form onSubmit={formik.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </label>
        <p style={{ color: "red" }}>{formik.errors.name}</p>

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default StudentList;
