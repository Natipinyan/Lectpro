import React, { useState } from "react";

const EditTechnologyForm = ({ tech, onClose, onSave }) => {
    const [techType, setTechType] = useState(tech.title);
    const [language, setLanguage] = useState(tech.language);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/technology/${tech.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ title: techType, language }),
                }
            );

            if (response.ok) {
                onSave();
                onClose();
            } else {
                alert("שגיאה בעדכון הטכנולוגיה");
            }
        } catch (err) {
            alert("שגיאה בשרת");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="edit-tech-form" onSubmit={handleSubmit}>
            <h3>עריכת טכנולוגיה</h3>

            <div className="form-section">
                <label className="form-label">סוג טכנולוגיה</label>
                <select
                    className="form-select"
                    value={techType}
                    onChange={(e) => setTechType(e.target.value)}
                    required
                >
                    <option value="">בחר סוג</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="data base">Data Base</option>
                    <option value="iot">IoT</option>
                </select>
            </div>

            <div className="form-section">
                <label className="form-label">שפת טכנולוגיה</label>
                <input
                    type="text"
                    className="form-input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                />
            </div>

            <div className="form-actions">
                <button type="submit"  className="save-btn" disabled={loading} >
                    {loading ? "שומר..." : "שמור"}
                </button>
                <button type="button" className="cancel-btn" onClick={onClose}>
                    ביטול
                </button>
            </div>
        </form>
    );
};

export default EditTechnologyForm;
