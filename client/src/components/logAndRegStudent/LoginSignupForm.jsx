import React, { useState } from 'react';
import '../../css/logAndReg/LoginSignupForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from "../projects/NotificationPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faEnvelope, faLock, faPhone, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginSignupForm = () => {
    const [isActive, setIsActive] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [showPassword, setShowPassword] = useState(false); // מצב להצגת סיסמה בלוגין
    const [showRegisterPassword, setShowRegisterPassword] = useState(false); // מצב להצגת סיסמה בהרשמה
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setIsActive(true);
    };

    const handleLoginClick = () => {
        setIsActive(false);
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

        if (!passwordRegex.test(pass)) {
            setError('הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד. אנגלית בלבד.');
            setNotificationType('error');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/students/register/Add`, {
                userName,
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                pass,
            });
            setError(response.data.message);
            setNotificationType('success');
            setTimeout(() => setError(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'שגיאה בהרשמה');
            setNotificationType('error');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/students/login/check`,
                { userName, password },
                { withCredentials: true }
            );

            if (response.data.loggedIn) {
                if (response.data.mustChangePassword) {
                    setError('הסיסמה שלך חייבת להשתנות. מעביר אותך לדף שינוי סיסמה...');
                    setNotificationType('error');
                    setTimeout(() => {
                        navigate('/students/Profile');
                        setError('');
                    }, 3000);
                    return;
                }

                navigate('/students/HomeStudent');
            } else {
                setError(response.data.message);
                setNotificationType('error');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בהתחברות לשרת');
            setNotificationType('error');
            console.error(err);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCloseNotification = () => {
        setError('');
        setNotificationType('');
    };

    return (
        <div className="bodyLogReg">
            <div className={`container ${isActive ? 'active' : ''}`}>
                <div className="form-box login">
                    <form onSubmit={handleSubmitLogin}>
                        <h1>כניסה</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                name="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="שם משתמש"
                                required
                            />
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="סיסמה"
                                required
                            />
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        <button type="submit" className="btn">
                            כניסה
                        </button>
                        <div className="forgot-link">
                            <button className="btnF">
                                <a href="#" onClick={() => navigate('/students/forgot-password')}>
                                    שכחת סיסמה?
                                </a>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form onSubmit={handleSubmitRegister}>
                        <h1>הרשמה - סטודנטים</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="שם פרטי"
                                required
                            />
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="שם משפחה"
                                required
                            />
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="שם משתמש"
                                required
                            />
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="כתובת אימייל"
                                required
                            />
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                    const onlyDigits = e.target.value.replace(/\D/g, ''); // מסיר כל תו שאינו ספרה
                                    setPhone(onlyDigits);
                                }}
                                placeholder="מספר טלפון"
                                required
                            />
                            <FontAwesomeIcon icon={faPhone} className="input-icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type={showRegisterPassword ? 'text' : 'password'}
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="סיסמה"
                                required
                            />
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <FontAwesomeIcon
                                icon={showRegisterPassword ? faEyeSlash : faEye}
                                className="toggle-password"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            />
                        </div>
                        <div>
                            הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד. אנגלית בלבד
                        </div>
                        <button type="submit" className="btn">
                            הרשמה
                        </button>
                    </form>
                </div>

                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <FontAwesomeIcon icon={faUser} className="toggle-icon" />
                        <h1>Hello, Welcome!</h1>
                        <p>אין לך חשבון?</p>
                        <button className="btn register-btn" onClick={handleRegisterClick}>
                            הרשמה
                        </button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <FontAwesomeIcon icon={faSignInAlt} className="toggle-icon" />
                        <h1>Welcome Back!</h1>
                        <p>יש לך חשבון?</p>
                        <button className="btn login-btn" onClick={handleLoginClick}>
                            כניסה
                        </button>
                    </div>
                </div>

                {error && (
                    <NotificationPopup
                        message={error}
                        type={notificationType}
                        onClose={handleCloseNotification}
                    />
                )}
            </div>
        </div>
    );
};

export default LoginSignupForm;