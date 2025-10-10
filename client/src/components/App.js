import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";

import NavBar from "./NavBar";
import Home from "./Home";
import AssignmentList from "./AssignmentList";
import StudentList from "./StudentList";
import StudentAssignments from "./StudentAssignments";
import GradesList from "./GradesList";

function App() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Fetch students and assignments once
  useEffect(() => {
    fetch("/students")
      .then(res => res.json())
      .then(data => setStudents(data));

    fetch("/assignments")
      .then(res => res.json())
      .then(data => setAssignments(data));
  }, []);

  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/assignments"
          render={() => (
            <AssignmentList
              assignments={assignments}
              setAssignments={setAssignments}
            />
          )}
        />
        <Route
          exact
          path="/students"
          render={(props) => (
            <StudentList
              {...props}
              students={students}
              setStudents={setStudents}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          )}
        />
        <Route
          exact
          path="/students/:studentId"
          render={(props) => (
            <StudentAssignments
              {...props}
              students={students}
              assignments={assignments}
            />
          )}
        />
        <Route
          exact
          path="/students/:studentId/assignments/:assignmentId"
          render={(props) => (
            <GradesList
              {...props}
              students={students}
              setStudents={setStudents}
              assignments={assignments}
            />
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
