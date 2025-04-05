import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../css/logAndReg/login.css';

const Login = ({ onLoginSuccess }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirectToHome, setRedirectToHome] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/students/login/chek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, password }),
        });

        const data = await response.json();

        if (data.loggedIn) {
            setMessage('Login successful!');

            Cookies.set('students', userName, { expires: 1 });
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            setRedirectToHome(true);
        } else {
            setMessage(data.message || 'Login failed.');
        }
    };

    if (redirectToHome) {
        return <Navigate to="/students/HomeStudent" />;
    }

    return (
        <div className="loginSection">
            <h1>התחברות - סטודנטים</h1>

            <button onClick={() => navigate('/instructor')} className="switchLoginButton">
                מעבר לכניסת מרצים
            </button>

            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        name="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="שם משתמש"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="סיסמה"
                    />
                </div>
                <div>
                    <input type="submit" value="כניסה" />
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
