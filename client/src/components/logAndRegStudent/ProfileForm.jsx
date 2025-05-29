import React from "react";

const ProfileForm = ({ userData, formData, setFormData, isEditing, setIsEditing, onSave, onCancel }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

                    <button onClick={onSave}>שמור</button>
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