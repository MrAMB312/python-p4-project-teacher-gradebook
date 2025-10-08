import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/students">Student List</Link></li>
        <li><Link to="/assignments">Assignment List</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
