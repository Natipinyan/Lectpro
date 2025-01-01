import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/globalStyles.css';


const Login = ({ onLoginSuccess }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirectToHome, setRedirectToHome] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login/chek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, password }),
        });

        const data = await response.json();

        if (data.loggedIn) {
            setMessage('Login successful!');

            Cookies.set('user', userName, { expires: 1 });
            onLoginSuccess();
            setRedirectToHome(true);
        } else {
            setMessage(data.message || 'Login failed.');
        }
    };

    if (redirectToHome) {
        return <Navigate to="/home" />;
    }

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        name="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <input type="submit" value="Login" />
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
