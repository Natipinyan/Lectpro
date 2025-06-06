import React, { useState } from "react";
import "../../css/logAndReg/profileFrome.css";

const ProfileForm = ({ userData, formData, setFormData, isEditing, setIsEditing, onSave, onCancel }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const password = formData.pass;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

        if (!passwordRegex.test(password)) {
            setErrorMessage('הסיסמה חייבת לכלול לפחות 8 תווים, אות קטנה, אות גדולה, מספר ותו מיוחד. אנגלית בלבד.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        setErrorMessage('');
        onSave();
    };

    return (
        <div>
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
                    <div className="form-section">
                        <label className="form-label">סיסמה:</label>
                        <input
                            className="text-input"
                            type="password"
                            name="pass"
                            value={formData.pass}
                            onChange={handleInputChange}
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

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
                        <button className="edit-button" onClick={() => setIsEditing(true)}>עריכה</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;