import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function StudentGrades({ studentId, studentName }) {
    const [grades, setGrades] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [editingGradeId, setEditingGradeId] = useState(null);
    const [refreshPage, setRefreshPage] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5555/students/${studentId}/grades`)
            .then(r => r.json())
            .then(data => setGrades(data));
    }, [studentId, refreshPage]);

    useEffect(() => {
        fetch("http://localhost:5555/assignments")
            .then(r => r.json())
            .then(data => setAssignments(data))
    }, []);

    const gradeSchema = yup.object().shape({
        assignment_id: yup.number().required("Select an assignment."),
        score: yup.number().required("Score required.").integer().min(0)
    });

    const addFormik = useFormik({
        initialValues: { assignment_id: "", score: "" },
        validationSchema: gradeSchema,
        onSubmit: (values, { resetForm }) => {
            fetch(`http://localhost:5555/students/${studentId}/grades`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then(res => {
                if (res.ok) setRefreshPage(!refreshPage);
            });
            resetForm();
        }
    })

    const editFormik = useFormik({
        initialValues: { score: "" },
        validationSchema: yup.object({ score: yup.number().required("Score required.").integer("Must be an integer.").min(0, "Score cannot be negative.") }),
        onSubmit: (values, { resetForm }) => {
            fetch(`http://localhost:5555/students/${studentId}/grades/${editingGradeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score: values.score }),
            }).then(res => {
                if (res.ok) setRefreshPage(!refreshPage);
            });
            setEditingGradeId(null);
            resetForm();
        }
    })

    function handleDeleteGrade(gradeId) {
        fetch(`http://localhost:5555/students/${studentId}/grades/${gradeId}`, { method: "DELETE" })
            .then(() => setRefreshPage(!refreshPage));
    }

    return (
        <div>
            <h2>Grades for {studentName}</h2>
            <ul>
                {grades.map(g => (
                    <li key={g.id}>
                        {g.assignment.title}: 
                        {editingGradeId === g.id ? (
                            <form onSubmit={editFormik.handleSubmit}>
                                <input 
                                    name="score"
                                    type="number"
                                    value={editFormik.values.score}
                                    onChange={editFormik.handleChange}
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingGradeId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                {g.score}
                                <button onClick={() => {
                                    setEditingGradeId(g.id);
                                    editFormik.setFieldValue({ score: g.score });
                                }}>Edit</button>
                                <button onClick={() => handleDeleteGrade(g.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <h3>Add a new grade</h3>
            <form onSubmit={addFormik.handleSubmit}>
                <select 
                    name="assignment_id"
                    value={addFormik.values.assignment_id}
                    onChange={addFormik.handleChange}
                >
                    <option value="">Select Assignment</option>
                    {assignments.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.title} ({a.category})
                        </option>
                    ))}
                </select>
                <p style={{ color: "red" }}>{addFormik.errors.assignment_id}</p>
                
                <input 
                    name="score"
                    type="number"
                    value={addFormik.values.score}
                    onChange={addFormik.handleChange}
                    placeholder="Score"
                />
                <p style={{ color: "red" }}>{addFormik.errors.score}</p>

                <button type="submit">Add Grade</button>
            </form>
        </div>
    );
}


export default StudentGrades;