import React, { useState, useEffect } from "react";
import "../../css/projects/openPro.css";

const OpenProject = ({ onSwitchToAddTechnology, showNotification }) => {
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [technologies, setTechnologies] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState([{ id: "", techType: "" }]);

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/technology/List`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setTechnologies(data);
                } else {
                    showNotification("אירעה שגיאה בטעינת הטכנולוגיות", "error");
                }
            } catch (error) {
                console.error("Error:", error);
                showNotification("שגיאה בחיבור לשרת", "error");
            }
        };
        fetchTechnologies();
    }, [showNotification]);

    const addTechnologyField = () => {
        setSelectedTechs([...selectedTechs, { id: "", techType: "" }]);
    };

    const removeTechnologyField = (index) => {
        if (selectedTechs.length > 1) {
            setSelectedTechs(selectedTechs.filter((_, i) => i !== index));
        }
    };

    const handleTechnologyChange = (index, techId) => {
        const selectedTech = technologies.find((tech) => tech.id === parseInt(techId));
        const updated = [...selectedTechs];
        updated[index] = { id: techId, techType: selectedTech?.title || "" };
        setSelectedTechs(updated);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!projectName.trim() || !projectDesc.trim()) {
            showNotification("יש למלא את שם ותיאור הפרויקט", "error");
            return;
        }

        const validTechs = selectedTechs.filter((t) => t.id && t.techType);
        if (validTechs.length === 0) {
            showNotification("יש לבחור לפחות טכנולוגיה אחת", "error");
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/projects/addproject`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        projectName,
                        projectDesc,
                        selectedTechnologies: validTechs,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                showNotification("הפרויקט נוסף בהצלחה!", "success");
                setProjectName("");
                setProjectDesc("");
                setSelectedTechs([{ id: "", techType: "" }]);
            } else {
                showNotification(data.message || "אירעה שגיאה", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("שגיאה בחיבור לשרת", "error");
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">יצירת פרויקט חדש</h1>
            <form id="openPro-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label className="form-label">שם הפרויקט</label>
                    <input
                        className="text-input"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-section">
                    <label className="form-label">תיאור הפרויקט</label>
                    <textarea
                        className="text-area"
                        rows="4"
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        required
                    />
                </div>

                {selectedTechs.map((tech, index) => (
                    <div className="form-section" key={index}>
                        <label className="form-label">בחר טכנולוגיה {index + 1}</label>
                        <select
                            className="form-select"
                            value={tech.id}
                            onChange={(e) => handleTechnologyChange(index, e.target.value)}
                            required
                        >
                            <option value="">בחר טכנולוגיה</option>
                            {technologies.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.language}
                                </option>
                            ))}
                        </select>
                        {tech.techType && (
                            <div className="form-section">
                                <label className="form-label">סוג טכנולוגיה</label>
                                <p className="tech-type">{tech.techType}</p>
                            </div>
                        )}
                        {selectedTechs.length > 1 && (
                            <button
                                type="button"
                                className="remove-tech-button"
                                onClick={() => removeTechnologyField(index)}
                            >
                                הסר
                            </button>
                        )}
                    </div>
                ))}

                <div className="form-section">
                    <button
                        type="button"
                        className="add-tech-button"
                        onClick={addTechnologyField}
                    >
                        הוסף טכנולוגיה
                    </button>
                </div>

                <div className="form-section">
                    <h2 className="form-subtitle">
                        משתמש בטכנולוגיה שלא עודכנה במערכת?
                    </h2>
                    <button
                        type="button"
                        className="add-tech-link"
                        onClick={onSwitchToAddTechnology}
                    >
                        הוסף טכנולוגיה חדשה
                    </button>
                </div>

                <div className="button-container">
                    <button className="primary-button" type="submit">
                        צור פרויקט
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OpenProject;