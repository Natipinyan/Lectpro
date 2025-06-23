import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/projects/AddProject.css";

const AddProject = ({
                        onSwitchToAddTechnology,
                        showNotification,
                        projectData,
                        updateProjectData,
                        resetProjectData,
                    }) => {
    const [technologies, setTechnologies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/technology/`,
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

    const toggleTechnology = (tech) => {
        const isSelected = projectData.selectedTechs.some(
            (selected) => selected.id === String(tech.id)
        );
        let updatedTechs;

        if (isSelected) {
            updatedTechs = projectData.selectedTechs.filter(
                (selected) => selected.id !== String(tech.id)
            );
        } else {
            updatedTechs = [
                ...projectData.selectedTechs,
                {
                    id: String(tech.id),
                    techType: tech.title,
                    language: tech.language || "",
                },
            ];
        }

        updateProjectData({ selectedTechs: updatedTechs });
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

        if (projectData.projectName.length > 25) {
            showNotification("שם הפרויקט לא יכול לעלות על 25 תווים", "error");
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
                `${process.env.REACT_APP_BASE_URL}/projects/`,
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
                showNotification("הפרויקט נוסף בהצלחה! מעביר אותך לדף העלאת מסמך", "success");
                resetProjectData();
                setTimeout(() => {
                    navigate("/students/UpFile");
                }, 3000);
            } else {
                showNotification(data.message || "אירעה שגיאה", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("שגיאה בחיבור לשרת", "error");
        }
    };

    return (
        <div className="open-pro-wrapper">
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="secLeft">
                    <div className="form-section">
                        <label className="form-label">שם הפרויקט</label>
                        <input
                            className="text-input"
                            value={projectData.projectName}
                            onChange={(e) => updateProjectData({ projectName: e.target.value })}
                            required
                            maxLength="25"
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
                </div>
                <div className="secRight">
                    <div className="form-section">
                        <label className="form-label">בחר טכנולוגיות</label>
                        <div className="tech-chips-container">
                            {technologies.map((tech) => {
                                const isSelected = projectData.selectedTechs.some(
                                    (selected) => selected.id === String(tech.id)
                                );
                                return (
                                    <div
                                        key={tech.id}
                                        className={`tech-chip ${isSelected ? "selected" : ""}`}
                                        onClick={() => toggleTechnology(tech)}
                                    >
                                        {tech.language}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="form-subtitle">
                            משתמש בטכנולוגיה שלא קיימת במערכת?
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
                </div>
            </form>
        </div>
    );
};

export default AddProject;