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
                <div className="nav-right-links">
                    <Link to="/" className="nav-link">דף בית</Link>
                </div>
            </nav>

            <nav className="nav-container">
                <div className="nav-left-links">
                    <Link to="/students">Login</Link> |
                    <Link to="/students/register">Register</Link> |
                    <Link to="/students/HomeStudent">Home</Link> |
                    <Link to="/students/PageOne">Page One</Link> |
                    <Link to="/students/PageTwo">Page Two</Link>
                    <Link to="/students/UpFile">UpFile</Link>
                    <div> - students link</div>
                </div>
                <div className="nav-right-links">
                    <div>instructor link -</div>
                    <Link to="/instructor">Login</Link> |
                    <Link to="/instructor/register">Register</Link> |
                    <Link to="/instructor/HomeInstructor">Home</Link>
                </div>
            </nav>
        </>
    );
}
