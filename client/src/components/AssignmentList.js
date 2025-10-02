import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function AssignmentList() {
    const [assignments, setAssignments] = useState([]);
    const [refreshPage, setRefreshPage] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5555/assignments")
            .then(r => r.json())
            .then(data => setAssignments(data));
    }, [refreshPage]);

    const formSchema = yup.object().shape({
        title: yup.string().required("Title required."),
        category: yup.string().required("Category required."),
        total_points: yup.number().positive().integer().required("Total points required.")
    });

    const formik = useFormik({
        initialValues: { title: "", category: "", total_points: "" },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("http://localhost:5555/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then(res => {
                if (res.ok) setRefreshPage(!refreshPage);
            });
            resetForm();
        }
    })

    return (
        <div>
            <h1>Assignment List</h1>
            
            <form onSubmit={formik.handleSubmit}>
                <input
                    name="title"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    placeholder="Title"
                />
                <p style={{ color: "red" }}>{formik.errors.title}</p>
                
                <input 
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                    placeholder="Category"
                />
                <p style={{ color: "red" }}>{formik.errors.category}</p>

                <input 
                    name="total_points"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.total_points}
                    placeholder="Total Points"
                />
                <p style={{ color: "red" }}>{formik.errors.total_points}</p>

                <button type="submit">Add Assignment</button>
            </form>

            <ul>
                {assignments.map(a => (
                    <li key={a.id}>
                        {a.title} ({a.category}) - {a.total_points} points
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AssignmentList;