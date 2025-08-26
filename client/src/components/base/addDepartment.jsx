import React, { useState } from 'react';
import '../../css/logAndReg/LoginSignupForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from "../projects/NotificationPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faLock,
    faPhone,
    faEye,
    faEyeSlash,
    faBuilding
} from '@fortawesome/free-solid-svg-icons';

const AddDepartment = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

        if (!passwordRegex.test(pass)) {
            setError('הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד.');
            setNotificationType('error');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/instructor/register/administrator`, {
                userName,
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                pass,
                department,
            });

            if (response.data.success) {
                setError(response.data.message);
                setNotificationType('success');
                setTimeout(() => navigate('/instructor/HomeInstructor'), 2000);
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

    const handleCloseNotification = () => {
        setError('');
        setNotificationType('');
    };

    return (
        <div className="bodyLogReg">
                <div className="register-wrapper">
                    <form onSubmit={handleSubmitRegister}>
                        <center><h1 >פתיחת מגמה חדשה</h1></center>
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
                        {/* שדה מגמה */}
                        <div className="input-box">
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="מגמה"
                                required
                            />
                            <FontAwesomeIcon icon={faBuilding} className="input-icon" />
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
                            הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד.
                        </div>
                        <button type="submit" className="btn">
                            הרשמה
                        </button>
                    </form>
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
export default AddDepartment;
