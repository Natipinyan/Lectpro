import { createBrowserRouter, Link } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import PrivateRoute from "./PrivateRoute";
import Home from "../components/Home";
import PageOne from "../components/PageOne";
import PageTwo from "../components/PageTwo";
import React from "react";

const onLoginSuccess = () => {
    console.log("Login successful!");
};

// יצירת הרוט
const MyRouter = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <h1>Home</h1>
                <Link to="/login">Login</Link> |
                <Link to="/register">Register</Link> |
                <Link to="/home">Home</Link> |
                <Link to="/PageOne">Page One</Link> |
                <Link to="/PageTwo">Page Two</Link>
            </>
        ),
    },
    {
        path: '/login',
        element: <Login onLoginSuccess={onLoginSuccess} />, // העברת הפונקציה למרכיב Login
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/home',
        element: <PrivateRoute element={Home} />, // הנחה שהמרכיב PrivateRoute בודק את החיבור
    },
    {
        path: '/PageOne',
        element: <PrivateRoute element={PageOne} />,
    },
    {
        path: '/PageTwo',
        element: <PrivateRoute element={PageTwo} />,
    },
]);

export default MyRouter;
