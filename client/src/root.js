import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import PrivateRoute from './services/PrivateRoute';  // Import the PrivateRoute component

export default function Root() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is already logged in
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute element={Home} />} />
                <Route path="/home" element={<PrivateRoute element={Home} />} />
                <Route path="/PageOne" element={<PrivateRoute element={PageOne} />} />
                <Route path="/PageTwo" element={<PrivateRoute element={PageTwo} />} />
            </Routes>
        </Router>
    );
}
