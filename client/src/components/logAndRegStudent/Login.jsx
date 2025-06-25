import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/logAndReg/login.css";

const LoginStudents = ({ onLoginSuccess }) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/students/login/`,
                { userName, password },
                { withCredentials: true }
            );
            if (response.data.success && response.data.data?.loggedIn) {
                onLoginSuccess();

                if (response.data.data.mustChangePassword) {
                    setMustChangePassword(true);
                    setTimeout(() => {
                        navigate("/students/Profile");
                    }, 2000);
                    return;
                }

                navigate("/students/HomeStudent");
            } else {
                setError(response.data.message || "שגיאה בהתחברות");
                setTimeout(() => setError(""), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "שגיאה בהתחברות לשרת");
            console.error(err);
            setTimeout(() => setError(""), 2000);
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
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="סיסמה"
                        required
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

            {mustChangePassword && (
                <p style={{ color: "orange", fontWeight: "bold" }}>
                    הסיסמה שלך חייבת להשתנות. מעביר אותך לדף שינוי סיסמה...
                </p>
            )}
        </div>
    );
};

export default LoginStudents;