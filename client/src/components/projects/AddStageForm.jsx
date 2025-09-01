import React, { useState } from "react";

const AddStageForm = ({ stages, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const sortedStages = stages ? [...stages].sort((a, b) => a.position - b.position) : [];

    const [position, setPosition] = useState(sortedStages.length + 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { title, position };

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stages`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (response.ok && data.success) {
                onSave();
                onClose();
            } else {
                alert(data.message || "שגיאה בהוספת השלב");
            }
        } catch (err) {
            alert("שגיאה בשרת");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-stage-form">
            <label>
                שם שלב:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label>
                מיקום:
                <select value={position} onChange={(e) => setPosition(Number(e.target.value))}>
                    {/* Generates an option for each possible position (from 1 to the end) */}
                    {Array.from({ length: sortedStages.length + 1 }, (_, index) => {
                        const newPos = index + 1;
                        let optionText = `מיקום ${newPos}`;

                        if (newPos === 1) {
                            optionText += " (התחלה)";
                        } else if (newPos === sortedStages.length + 1) {
                            optionText += " (סוף)";
                        } else {
                            // Find the stage that will be at the position *after* the new stage
                            const nextStage = sortedStages.find(s => s.position === newPos);
                            if (nextStage) {
                                optionText += ` (לפני ${nextStage.title})`;
                            }
                        }

                        return (
                            <option key={newPos} value={newPos}>
                                {optionText}
                            </option>
                        );
                    })}
                </select>
            </label>

            <div className="form-buttons">
                <button type="submit">הוסף</button>
                <button type="button" onClick={onClose}>ביטול</button>
            </div>
        </form>
    );
};

export default AddStageForm;