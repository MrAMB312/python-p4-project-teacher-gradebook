import { useState } from "react";
import StudentGrades from "./StudentGrades";
import { useFormik } from "formik";
import * as yup from "yup";

function StudentList({ students, assignments, addStudent, addGrade, editGrade, deleteGrade }) {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const formSchema = yup.object().shape({
    name: yup.string().required("Name is required.")
  });

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      addStudent(values);
      resetForm();
    }
  });

  return (
    <div>
      <h1>Student List</h1>

      <form onSubmit={formik.handleSubmit}>
        <input
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          placeholder="New Student"
        />
        <p style={{ color: "red" }}>{formik.errors.name}</p>
        <button type="submit">Add Student</button>
      </form>

      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name}{" "}
            <button onClick={() => setSelectedStudent(s)}>
              View Grades
            </button>
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <StudentGrades
          student={selectedStudent}
          assignments={assignments}
          onAddGrade={addGrade}
          onEditGrade={editGrade}
          onDeleteGrade={deleteGrade}
        />
      )}
    </div>
  );
}

export default StudentList;
