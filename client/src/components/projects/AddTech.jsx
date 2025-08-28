import React, { useState } from "react";

const AddTechnology = ({ onBackToProject, showNotification }) => {
    const [name, setName] = useState("");
    const [techType, setTechType] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim() || !techType) {
            showNotification("נא למלא את כל השדות", "error");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/technology/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    technologyName: name,
                    technologyTitle: techType,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                showNotification("הטכנולוגיה נוספה בהצלחה", "success");
                setName("");
                setTechType("");
                onBackToProject();
            } else {
                showNotification(data.message || "אירעה שגיאה", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification("שגיאה בחיבור לשרת", "error");
        }
    };

    return (
        <div className="form-container">
            <form id="openPro-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label className="form-label">שם הטכנולוגיה</label>
                    <input
                        className="text-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <div className="button-container">
                    <button className="primary-button" type="submit">
                        צור טכנולוגיה
                    </button>
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onBackToProject}
                    >
                        חזרה
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTechnology;