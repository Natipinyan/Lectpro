import React, { useState, useEffect } from 'react';
import '../../css/logAndReg/LoginSignupForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from "../projects/NotificationPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faEnvelope, faLock, faPhone, faEye, faEyeSlash, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const LoginSignupFormINS = () => {
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
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:5000/departments/all");
                if (response.data.success) {
                    setDepartments(response.data.data);
                }
                console.log(response.data);
            } catch (err) {
                console.error("שגיאה בטעינת מגמות:", err);
            }
        };
        fetchDepartments();
    }, []);

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
            setError('הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד. אנא בדוק.');
            setNotificationType('error');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/instructor/register/`, {
                userName,
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                pass,
                department_id: departmentId,
            });
            if (response.data.success) {
                setError(response.data.message);
                setNotificationType('success');
            } else {
                setError(response.data.message || 'שגיאה בהרשמה');
                setNotificationType('error');
            }
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
                `${process.env.REACT_APP_BASE_URL}/instructor/login/`,
                { userName, password },
                { withCredentials: true }
            );
            if (response.data.success && response.data.loggedIn) {
                if (response.data.mustChangePassword) {
                    setError('השתמשת בסיסמה חד פעמית לאיפוס סיסמתך, יש לשנות את הסיסמה. מעביר אותך לדף שינוי סיסמה');
                    setNotificationType('error');
                    setTimeout(() => {
                        navigate('/instructor/Profile');
                        setError('');
                    }, 3000);
                    return;
                }
                navigate('/instructor/HomeInstructor');
            } else {
                setError(response.data.message || 'שגיאה בהתחברות');
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

    const handleStudentSectionClick = () => {
        navigate('/students');
    };

    return (
        <div className="bodyLogReg">
            <div className={`container ${isActive ? 'active' : ''}`}>
                {/* טופס כניסה */}
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
                            <button className="btnF" type="button" onClick={() => navigate('/instructor/forgot-password')}>
                                שכחת סיסמה?
                            </button>
                        </div>
                    </form>
                </div>

                {/* טופס הרשמה */}
                <div className="form-box register">
                    <form onSubmit={handleSubmitRegister}>
                        <h1>הרשמה - מרצים</h1>
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
                                    const onlyDigits = e.target.value.replace(/\D/g, '');
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

                        <div className="input-box">
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                required
                            >
                                <option value="">בחר מגמה</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.id}>
                                        {dep.name}
                                    </option>
                                ))}
                            </select>
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="input-icon" />
                        </div>

                        <div>
                            הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד.
                        </div>
                        <button type="submit" className="btn">
                            הרשמה
                        </button>
                    </form>
                </div>

                {/* toggle בין כניסה להרשמה */}
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <FontAwesomeIcon icon={faUser} className="toggle-icon" />
                        <h1>Hello, Welcome!</h1>
                        <p>אין לך חשבון?</p>
                        <button className="btn register-btn" onClick={handleRegisterClick}>
                            הרשמה
                        </button>
                        <button className="btn switchUser-btn" onClick={handleStudentSectionClick}>
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="btn-icon" />
                            כניסה לסטודנטים
                        </button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <FontAwesomeIcon icon={faSignInAlt} className="toggle-icon" />
                        <h1>Welcome Back!</h1>
                        <p>יש לך כבר חשבון?</p>
                        <button className="btn login-btn" onClick={handleLoginClick}>
                            כניסה
                        </button>
                        <button className="btn switchUser-btn" onClick={handleStudentSectionClick}>
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="btn-icon" />
                            כניסה לסטודנטים
                        </button>
                    </div>
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
    );
};

export default LoginSignupFormINS;
