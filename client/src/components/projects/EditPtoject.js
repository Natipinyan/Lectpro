import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopup";
import "../../css/projects/AddProject.css";

const EditProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({
        projectName: "",
        projectDesc: "",
        linkToGithub: "",
        selectedTechs: [],
    });
    const [technologies, setTechnologies] = useState([]);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const projectResponse = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/projects/${projectId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const projectData = await projectResponse.json();
                if (!projectResponse.ok || !projectData.success) {
                    throw new Error(projectData.message || "שגיאה בטעינת פרטי הפרויקט");
                }

                const techResponse = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/technology/`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const techData = await techResponse.json();
                if (!techResponse.ok || !techData.success) {
                    throw new Error(techData.message || "שגיאה בטעינת הטכנולוגיות");
                }

                const projectTechResponse = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/projects/${projectId}/technologies`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const projectTechData = await projectTechResponse.json();
                if (!projectTechResponse.ok || !projectTechData.success) {
                    throw new Error(projectTechData.message || "שגיאה בטעינת טכנולוגיות הפרויקט");
                }

                setProjectData({
                    projectName: projectData.data.title || "",
                    projectDesc: projectData.data.description || "",
                    linkToGithub: projectData.data.link_to_github || "",
                    selectedTechs: projectTechData.data.map((tech) => ({
                        id: String(tech.id),
                        techType: tech.title,
                    })),
                });
                setTechnologies(techData.data);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError(err.message || "אירעה שגיאה בטעינת נתוני הפרויקט");
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));
    };

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
                },
            ];
        }

        setProjectData((prev) => ({ ...prev, selectedTechs: updatedTechs }));
    };

    const validateGithubLink = (link) => {
        if (!link) return true;
        return /^https:\/\/github\.com\/.+$/.test(link);
    };

    const handleSave = async () => {
        if (!projectData.projectName.trim() || !projectData.projectDesc.trim()) {
            setNotification({
                message: "יש למלא את שם ותיאור הפרויקט",
                type: "error",
            });
            return;
        }

        if (!validateGithubLink(projectData.linkToGithub)) {
            setNotification({
                message: "נא להזין קישור תקין ל-GitHub",
                type: "error",
            });
            return;
        }

        const validTechs = projectData.selectedTechs.filter((t) => t.id && t.techType);
        if (validTechs.length === 0) {
            setNotification({
                message: "יש לבחור לפחות טכנולוגיה אחת",
                type: "error",
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    projectName: projectData.projectName,
                    projectDesc: projectData.projectDesc,
                    linkToGithub: projectData.linkToGithub || null,
                    selectedTechnologies: validTechs,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setNotification({
                    message: "הפרויקט עודכן בהצלחה!",
                    type: "success",
                });
                setTimeout(() => {
                    navigate("/students/MyProjects");
                }, 3000);
            } else {
                setNotification({
                    message: data.message || "אירעה שגיאה",
                    type: "error",
                });
            }
        } catch (err) {
            console.error("שגיאה:", err);
            setNotification({
                message: "שגיאה בחיבור לשרת",
                type: "error",
            });
        }
    };

    const handleCancel = () => {
        navigate("/students/MyProjects");
    };

    if (loading) {
        return <div className="open-pro-wrapper">טוען...</div>;
    }

    if (error) {
        return (
            <div className="open-pro-wrapper">
                <div className="form-container">
                    <div className="error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="open-pro-wrapper">
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="form-container">
                <h1 className="form-title">עריכת פרויקט</h1>
                <div className="secLeft">
                    <div className="form-section">
                        <label className="form-label">שם הפרויקט</label>
                        <input
                            className="text-input"
                            type="text"
                            name="projectName"
                            value={projectData.projectName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-section">
                        <label className="form-label">תיאור הפרויקט</label>
                        <textarea
                            className="text-area"
                            rows="4"
                            name="projectDesc"
                            value={projectData.projectDesc}
                            onChange={handleInputChange}
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
                            name="linkToGithub"
                            value={projectData.linkToGithub}
                            onChange={handleInputChange}
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
                    <div className="button-container">
                        <button className="primary-button" onClick={handleSave}>
                            שמור
                        </button>
                        <button className="secondary-button" onClick={handleCancel}>
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProject;