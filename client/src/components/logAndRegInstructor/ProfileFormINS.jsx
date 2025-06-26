import React, { useState } from "react";
import "../../css/logAndReg/profileFrome.css";
import NotificationPopup from "../projects/NotificationPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ProfileFormINS = ({ userData, formData, setFormData, isEditing, setIsEditing, onSave, onCancel }) => {
    const [notification, setNotification] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (showPasswordInput) {
            const password = formData.pass;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
            if (!passwordRegex.test(password)) {
                setNotification({
                    message: 'הסיסמה חייבת לכלול לפחות 8 תווים, אות קטנה, אות גדולה, מספר ותו מיוחד. אנא בדוק.',
                    type: 'error'
                });
                return;
            }
        } else {
            setFormData((prev) => ({ ...prev, pass: '' }));
        }
        onSave();
    };

    return (
        <div>
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {isEditing ? (
                <div>
                    <div className="form-section">
                        <label className="form-label">שם משתמש:</label>
                        <input
                            className="text-input"
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-section">
                        <label className="form-label">שם פרטי:</label>
                        <input
                            className="text-input"
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-section">
                        <label className="form-label">שם משפחה:</label>
                        <input
                            className="text-input"
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-section">
                        <label className="form-label">אימייל:</label>
                        <input
                            className="text-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-section">
                        <label className="form-label">טלפון:</label>
                        <input
                            className="text-input"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-section" style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="button" className="secondary-button" onClick={() => setShowPasswordInput((v) => !v)}>
                            {showPasswordInput ? 'ביטול שינוי סיסמה' : 'שנה סיסמה'}
                        </button>
                    </div>
                    {showPasswordInput && (
                        <div className="form-section">
                            <label className="form-label">סיסמה חדשה:</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="text-input"
                                    type={showPassword ? 'text' : 'password'}
                                    name="pass"
                                    value={formData.pass}
                                    onChange={handleInputChange}
                                    style={{ paddingRight: '10px', paddingLeft: '35px' }}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="toggle-password"
                                    style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="button-container">
                        <button className="primary-button" onClick={handleSave}>שמור</button>
                        <button className="secondary-button" onClick={onCancel}>ביטול</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="form-section">
                        <span className="form-label">שם משתמש:</span>
                        <span className="form-value">{userData.user_name || "לא זמין"}</span>
                    </div>
                    <div className="form-section">
                        <span className="form-label">שם פרטי:</span>
                        <span className="form-value">{userData.first_name || "לא זמין"}</span>
                    </div>
                    <div className="form-section">
                        <span className="form-label">שם משפחה:</span>
                        <span className="form-value">{userData.last_name || "לא זמין"}</span>
                    </div>
                    <div className="form-section">
                        <span className="form-label">אימייל:</span>
                        <span className="form-value">{userData.email || "לא זמין"}</span>
                    </div>
                    <div className="form-section">
                        <span className="form-label">טלפון:</span>
                        <span className="form-value">{userData.phone || "לא זמין"}</span>
                    </div>
                    <div className="button-container">
                        <button className="edit-button-profil" onClick={() => setIsEditing(true)}>עריכה</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileFormINS; 