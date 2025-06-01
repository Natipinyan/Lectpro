import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/logAndReg/forgotPassword.css";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/students/register/resetPass`,
                { email },
                { withCredentials: true }
            );
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "אירעה שגיאה בשליחת הבקשה");
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>איפוס סיסמה</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="הכנס כתובת מייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">שלח קוד איפוס</button>
            </form>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button onClick={() => navigate("/students")}>חזרה להתחברות</button>
        </div>
    );
};

export default ForgotPassword;
