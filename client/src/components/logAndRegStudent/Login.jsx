import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/logAndReg/login.css";

const LoginStudents = ({ onLoginSuccess }) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/students/login/check",
                { userName, password },
                { withCredentials: true }
            );
            if (response.data.loggedIn) {
                onLoginSuccess();
                navigate("/students/HomeStudent");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error connecting to server");
            console.error(err);
        }
    };

    return (
        <div className="loginSection">
            <h1>התחברות - סטודנטים</h1>

            <button
                onClick={() => navigate("/instructor")}
                className="switchLoginButton"
            >
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
                <div>
                    <button
                        type="button"
                        className="forgotPasswordButton"
                        onClick={() => navigate("/students/forgot-password")}
                    >
                        שכחתי סיסמה
                    </button>
                </div>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default LoginStudents;
