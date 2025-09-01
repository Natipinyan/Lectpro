import React, { useState } from "react";

const EditStageForm = ({ stage, stages, onClose, onSave }) => {
    const [title, setTitle] = useState(stage.title);
    const sortedStages = stages ? [...stages].sort((a, b) => a.position - b.position) : [];
    // שמירת המיקום הנוכחי של השלב כערך ההתחלתי
    const [position, setPosition] = useState(stage.position);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { title, position };

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stages/${stage.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (response.ok && data.success) {
                onSave();
                onClose();
            } else {
                alert(data.message || "שגיאה בעדכון השלב");
            }
        } catch (err) {
            alert("שגיאה בשרת");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-stage-form">
            <label>
                שם שלב:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label>
                מיקום:
                {/* שינוי כאן: יצירת אופציות עבור כל מיקום אפשרי מ-1 ועד סוף הרשימה */}
                <select value={position} onChange={(e) => setPosition(Number(e.target.value))}>
                    {sortedStages.map((s, index) => (
                        // חשוב: השתמש ב-index + 1 כערך המיקום, כי מערכים מתחילים מ-0 ומיקומים מ-1.
                        <option key={s.id} value={index + 1}>
                            {/* הצגת המיקום ומולו השם של השלב שכבר נמצא שם */}
                            {`מיקום ${index + 1}: ${s.title}`}
                        </option>
                    ))}
                    {/* אופציה מיוחדת להזזת השלב לסוף הרשימה */}
                    <option value={sortedStages.length + 1}>
                        בסוף הרשימה (מיקום {sortedStages.length + 1})
                    </option>
                </select>
            </label>

            <div className="form-buttons">
                <button type="submit">שמור</button>
                <button type="button" onClick={onClose}>ביטול</button>
            </div>
        </form>
    );
};

export default EditStageForm;