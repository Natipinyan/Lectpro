import React, { useState, useEffect } from "react";
import "../../css/projects/openPro.css";

const OpenProject = ({
                         onSwitchToAddTechnology,
                         showNotification,
                         projectData,
                         updateProjectData,
                         resetProjectData,
                     }) => {
    const [technologies, setTechnologies] = useState([]);

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
        updateProjectData({
            selectedTechs: [...projectData.selectedTechs, { id: "", techType: "" }],
        });
    };

    const removeTechnologyField = (index) => {
        if (projectData.selectedTechs.length > 1) {
            updateProjectData({
                selectedTechs: projectData.selectedTechs.filter((_, i) => i !== index),
            });
        }
    };

    const handleTechnologyChange = (index, techId) => {
        const selectedTech = technologies.find((tech) => tech.id === parseInt(techId));
        const updated = [...projectData.selectedTechs];
        updated[index] = { id: techId, techType: selectedTech?.title || "" };
        updateProjectData({ selectedTechs: updated });
    };

    const validateGithubLink = (link) => {
        if (!link) return true;
        return /^https:\/\/github\.com\/.+$/.test(link);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!projectData.projectName.trim() || !projectData.projectDesc.trim()) {
            showNotification("יש למלא את שם ותיאור הפרויקט", "error");
            return;
        }

        if (!validateGithubLink(projectData.linkToGithub)) {
            showNotification("נא להזין קישור תקין ל-GitHub", "error");
            return;
        }

        const validTechs = projectData.selectedTechs.filter((t) => t.id && t.techType);
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
                        projectName: projectData.projectName,
                        projectDesc: projectData.projectDesc,
                        linkToGithub: projectData.linkToGithub || null,
                        selectedTechnologies: validTechs,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                showNotification("הפרויקט נוסף בהצלחה!", "success");
                resetProjectData();
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
                        value={projectData.projectName}
                        onChange={(e) => updateProjectData({ projectName: e.target.value })}
                        required
                    />
                </div>

                <div className="form-section">
                    <label className="form-label">תיאור הפרויקט</label>
                    <textarea
                        className="text-area"
                        rows="4"
                        value={projectData.projectDesc}
                        onChange={(e) => updateProjectData({ projectDesc: e.target.value })}
                        required
                    />
                </div>

                <div className="form-section">
                    <label className="form-label">קישור ל-GitHub</label>
                    <label className="form-label form-hint">
                        אל דאגה, גם אם עדיין אין לך ריפו תמיד תוכל לעדכן אחר כך את הקישור :)
                    </label>
                    <input
                        className="text-input"
                        type="url"
                        value={projectData.linkToGithub}
                        onChange={(e) => updateProjectData({ linkToGithub: e.target.value })}
                        placeholder="https://github.com/example/repo"
                    />
                </div>

                {projectData.selectedTechs.map((tech, index) => (
                    <div className="form-section" key={index}>
                        <label className="form-label">בחר טכנולוגיה {index + 1}</label>
                        <select
                            className="form-select"
                            value={tech.id}
                            onChange={(e) => handleTechnologyChange(index, e.target.value)}
                            required
                        >
                            <option value="">בחר טכנולוגיה</option>
                            {technologies
                                .filter(
                                    (t) =>
                                        // שמור את האופציה אם היא עוד לא נבחרה בשדות אחרים, או שהיא האופציה שנבחרה כרגע בשדה הנוכחי
                                        !projectData.selectedTechs.some((selected, i) => selected.id === String(t.id) && i !== index)
                                )
                                .map((t) => (
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
                        {projectData.selectedTechs.length > 1 && (
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