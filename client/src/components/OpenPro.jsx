import React, { useState } from "react";
import "../css/openPro.css";

const OpenPro = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!projectName.trim() || !projectDesc.trim()) {
            alert("יש למלא את כל השדות.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/projects/addproject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    projectName,
                    projectDesc,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("הפרויקט נוסף בהצלחה!");
                setProjectName("");
                setProjectDesc("");
            } else {
                alert(data.message || "אירעה שגיאה");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("שגיאה בחיבור לשרת");
        }
    };

    return (
        <div>
            <h1 className="upMessage">:יצירת פרויקט חדש</h1>
            <form id="openPro-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label htmlFor="project-name" className="formLabel">:שם הפרוייקט</label>
                    <input
                        type="text"
                        id="project-name"
                        className="text-input"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="project-desc" className="formLabel">:תיאור הפרוייקט</label>
                    <textarea
                        id="project-desc"
                        className="text-area"
                        rows="4"
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        required
                    />
                </div>

                <div className="button-container">
                    <button className="button" id="toUploadPage" type="submit">
                        ליצירת הפרוייקט
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OpenPro;