import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import StudentList from "./StudentList";
import AssignmentList from "./AssignmentList";
import Home from "./Home";
import { useState, useEffect } from "react";

function App() {
 const [students, setStudents] = useState([]);
 const [assignments, setAssignments] = useState([]);

 useEffect(() => {
  fetch("http://localhost:5555/students")
   .then(r => r.json())
   .then(data => setStudents(data));
 }, []);

 useEffect(() => {
  fetch("http://localhost:5555/assignments")
   .then(r => r.json())
   .then(data => setAssignments(data));
 }, []);

 const addStudent = (newStudent) => {
  fetch("http://localhost:5555/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent),
  })
    .then(res => res.json())
    .then(data => setStudents(prev => [...prev, data]));
 };

const addAssignment = (newAssignment) => {
  fetch("http://localhost:5555/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAssignment),
  })
    .then(res => res.json())
    .then(data => setAssignments(prev => [...prev, data]));
};

const addGrade = (studentId, grade) => {
  fetch(`http://localhost:5555/students/${studentId}/assignments/${grade.assignment_id}/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score: grade.score }),
  })
    .then(res => res.json())
    .then(newGrade => {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const updatedAssignments = s.assignments.map(a => {
            if (a.id === newGrade.assignment_id) {
              return { ...a, grades: [...a.grades, newGrade] };
            }
            return a;
          });
          return { ...s, assignments: updatedAssignments };
        }
        return s;
      }));
    });
};

const editGrade = (studentId, gradeId, newScore) => {
  fetch(`http://localhost:5555/students/${studentId}/grades/${gradeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score: newScore }),
  })
    .then(res => res.json())
    .then(updatedGrade => {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const updatedAssignments = s.assignments.map(a => {
            const updatedGrades = a.grades.map(g => g.id === gradeId ? { ...g, score: updatedGrade.score } : g);
            return { ...a, grades: updatedGrades };
          });
          return { ...s, assignments: updatedAssignments };
        }
        return s;
      }));
    });
};

const deleteGrade = (studentId, gradeId) => {
  fetch(`http://localhost:5555/students/${studentId}/grades/${gradeId}`, {
    method: "DELETE"
  }).then(() => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedAssignments = s.assignments.map(a => {
          const updatedGrades = a.grades.filter(g => g.id !== gradeId);
          return { ...a, grades: updatedGrades };
        });
        return { ...s, assignments: updatedAssignments };
      }
      return s;
    }));
  });
};

 return (
  <div>
    <NavBar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/students">
        <StudentList
          students={students}
          assignments={assignments}
          addStudent={addStudent}
          addGrade={addGrade}
          editGrade={editGrade}
          deleteGrade={deleteGrade}
        />
      </Route>
      <Route path="/assignments">
        <AssignmentList assignments={assignments} addAssignment={addAssignment} />
      </Route>
    </Switch>
  </div>
 );
}
export default App;
