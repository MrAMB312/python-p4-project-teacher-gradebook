import { useState, useEffect } from "react";
import StudentGrades from "./StudentGrades";
import { useFormik } from "formik";
import * as yup from "yup";

function StudentList() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [refreshPage, setRefreshPage] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5555/students")
            .then(r => r.json())
            .then(data => setStudents(data));
    }, [refreshPage]);

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is required.")
    })

    const formik = useFormik({
        initialValues: { name: "" },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("http://localhost:5555/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then(res => {
                if (res.ok) setRefreshPage(!refreshPage);
            });
            resetForm();
        }
    })

    function handleSelectStudent(student) {
        setSelectedStudent(student);
    }

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
                {students.map(s => (
                    <li key={s.id}>
                        {s.name}
                        <button onClick={() => handleSelectStudent(s)}>
                            View Grades
                        </button>
                    </li>
                ))}
            </ul>

            {selectedStudent && (
                <StudentGrades 
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.name}
                />
            )}
        </div>
    )
}

export default StudentList;