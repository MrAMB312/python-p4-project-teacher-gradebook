import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import StudentList from "./StudentList";
import AssignmentList from "./AssignmentList";
import Home from "./Home";

function App() {
 return (
  <div>
    <NavBar />

    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/students" component={StudentList} />
      <Route path="/assignments" component={AssignmentList} />
    </Switch>
  </div>
 );
}
export default App;
