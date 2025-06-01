import React, { useState } from "react";

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
                    <p>
                        <strong>שם משתמש:</strong>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p>
                        <strong>שם פרטי:</strong>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p>
                        <strong>שם משפחה:</strong>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p>
                        <strong>אימייל:</strong>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p>
                        <strong>טלפון:</strong>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </p>
                    <p>
                        <strong>סיסמה:</strong>
                        <input
                            type="password"
                            name="pass"
                            value={formData.pass}
                            onChange={handleInputChange}
                        />
                    </p>

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <button onClick={handleSave}>שמור</button>
                    <button onClick={onCancel} style={{ marginRight: "10px" }}>
                        ביטול
                    </button>
                </div>
            ) : (
                <div>
                    <p><strong>שם משתמש:</strong> {userData.user_name || "לא זמין"}</p>
                    <p><strong>שם פרטי:</strong> {userData.first_name || "לא זמין"}</p>
                    <p><strong>שם משפחה:</strong> {userData.last_name || "לא זמין"}</p>
                    <p><strong>אימייל:</strong> {userData.email || "לא זמין"}</p>
                    <p><strong>טלפון:</strong> {userData.phone || "לא זמין"}</p>
                    <button onClick={() => setIsEditing(true)}>עריכה</button>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;
