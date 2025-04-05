import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
    return (
        <>
            <nav className="nav-container">
                <div className="nav-left-links">
                    <Link to="/privatArea" className="nav-link">איזור אישי</Link>
                    <Link to="/" className="nav-link">התראות</Link>
                </div>
                <Link to="/" className="nav-link nav-right">דף בית</Link>
            </nav>
            <nav className="nav-container">
                <Link to="/students">Login</Link> |
                <Link to="/students/register">Register</Link> |
                <Link to="/students/HomeStudent">Home</Link> |
                <Link to="/students/PageOne">Page One</Link> |
                <Link to="/students/PageTwo">Page Two</Link>
            </nav>

        </>



    );
}
