import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <nav>
            <h1>Site Navigation</h1>
            <Link to="/home">Home</Link> |
            <Link to="/login">Login</Link> |
            <Link to="/register">Register</Link> |
            <Link to="/PageOne">Page One</Link> |
            <Link to="/PageTwo">Page Two</Link>
        </nav>
    );
};

export default Navigation;
