import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/logAndReg/forgotPassword.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import NotificationPopup from "../projects/NotificationPopup";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setShowNotification(false);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/students/register/forgot-password`,
                { email },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setMessage(response.data.message || "נשלח קישור לאיפוס סיסמה");
                setNotificationType("success");
                setShowNotification(true);
            } else {
                setError(response.data.message || "אירעה שגיאה בשליחת הבקשה");
                setNotificationType("error");
                setShowNotification(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "אירעה שגיאה בשליחת הבקשה");
            setNotificationType("error");
            setShowNotification(true);
        }
    };

    useEffect(() => {
        if (showNotification && notificationType === "success") {
            const timer = setTimeout(() => {
                navigate("/students");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showNotification, notificationType, navigate]);

    return (
        <div className="forgot-password-container">
            <h2>איפוס סיסמה</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="הכנס כתובת מייל"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                </div>
                <button type="submit">שלח קוד איפוס</button>
            </form>
            {showNotification && (
                <NotificationPopup
                    message={notificationType === "success" ? message : error}
                    type={notificationType}
                    onClose={() => setShowNotification(false)}
                />
            )}
            <button onClick={() => navigate("/students")}>חזרה להתחברות</button>
        </div>
    );
};

export default ForgotPassword;