import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
    return (
        <>
            <nav className="nav-container">
                <div className="nav-left-links">
                    <Link to="/" className="nav-link">איזור אישי</Link>
                    <Link to="/" className="nav-link">התראות</Link>
                </div>
                <Link to="/" className="nav-link nav-right">דף בית</Link>
            </nav>
            <nav className="nav-container">
                <Link to="/">Login</Link> |
                <Link to="/register">Register</Link> |
                <Link to="/home">Home</Link> |
                <Link to="/PageOne">Page One</Link> |
                <Link to="/PageTwo">Page Two</Link>
            </nav>

        </>



    );
}
