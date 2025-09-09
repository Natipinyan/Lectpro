import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopup";
import AddTechnology from "./AddTech";
import Modal from "../base/Modal";

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
    const [isAddingTechModalOpen, setIsAddingTechModalOpen] = useState(false);

    const showNotification = (message, type) => setNotification({ message, type });

    useEffect(() => {
        const fetchProjectAndTech = async () => {
            try {
                setLoading(true);

                const projectResponse = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/projects/${projectId}`,
                    { method: "GET", credentials: "include" }
                );
                const projectDataJson = await projectResponse.json();
                if (!projectResponse.ok || !projectDataJson.success)
                    throw new Error(projectDataJson.message || "שגיאה בטעינת פרטי הפרויקט");

                const projectTechResponse = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/projects/${projectId}/technologies`,
                    { method: "GET", credentials: "include" }
                );
                const projectTechDataJson = await projectTechResponse.json();
                if (!projectTechResponse.ok || !projectTechDataJson.success)
                    throw new Error(projectTechDataJson.message || "שגיאה בטעינת טכנולוגיות הפרויקט");

                setProjectData({
                    projectName: projectDataJson.data.title || "",
                    projectDesc: projectDataJson.data.description || "",
                    linkToGithub: projectDataJson.data.link_to_github || "",
                    selectedTechs: projectTechDataJson.data.map((tech) => ({
                        id: String(tech.id),
                        techType: tech.title,
                    })),
                });

                const techResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/technology/`, {
                    method: "GET",
                    credentials: "include",
                });
                const techData = await techResponse.json();
                if (!techResponse.ok || !techData.success)
                    throw new Error(techData.message || "שגיאה בטעינת הטכנולוגיות");
                setTechnologies(techData.data);

                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError(err.message || "אירעה שגיאה בטעינת נתוני הפרויקט");
                setLoading(false);
            }
        };

        fetchProjectAndTech();
    }, [projectId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTechnology = (tech) => {
        const isSelected = projectData.selectedTechs.some((selected) => selected.id === String(tech.id));
        const updatedTechs = isSelected
            ? projectData.selectedTechs.filter((selected) => selected.id !== String(tech.id))
            : [...projectData.selectedTechs, { id: String(tech.id), techType: tech.title }];
        setProjectData((prev) => ({ ...prev, selectedTechs: updatedTechs }));
    };

    const validateGithubLink = (link) => !link || /^https:\/\/github\.com\/.+$/.test(link);

    const handleSave = async () => {
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
                showNotification("הפרויקט עודכן בהצלחה!", "success");
                setTimeout(() => navigate("/students/MyProjects"), 3000);
            } else {
                showNotification(data.message || "אירעה שגיאה", "error");
            }
        } catch (err) {
            console.error("שגיאה:", err);
            showNotification("שגיאה בחיבור לשרת", "error");
        }
    };

    const handleCancel = () => navigate("/students/MyProjects");

    if (loading) return <div className="open-pro-wrapper">טוען...</div>;
    if (error) return <div className="open-pro-wrapper"><div className="form-container"><div className="error">{error}</div></div></div>;

    return (
        <div className="open-pro-wrapper">
            {notification && <NotificationPopup message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <div className="form-container">
                <h1 className="form-title">עריכת פרויקט</h1>
                <div className="secLeft">
                    <div className="form-section">
                        <label className="form-label">שם הפרויקט</label>
                        <input className="text-input" type="text" name="projectName" value={projectData.projectName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-section">
                        <label className="form-label">תיאור הפרויקט</label>
                        <textarea className="text-area" rows="4" name="projectDesc" value={projectData.projectDesc} onChange={handleInputChange} required />
                    </div>
                    <div className="form-section">
                        <label className="form-label">קישור ל-GitHub</label>
                        <input className="text-input" type="url" name="linkToGithub" value={projectData.linkToGithub} onChange={handleInputChange} placeholder="https://github.com/example/repo" />
                    </div>
                </div>
                <div className="secRight">
                    <div className="form-section">
                        <label className="form-label">בחר טכנולוגיות</label>
                        <div className="tech-chips-container">
                            {technologies.map((tech) => {
                                const isSelected = projectData.selectedTechs.some((selected) => selected.id === String(tech.id));
                                return (
                                    <div key={tech.id} className={`tech-chip ${isSelected ? "selected" : ""}`} onClick={() => toggleTechnology(tech)}>
                                        {tech.language}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="form-subtitle">משתמש בטכנולוגיה שלא קיימת במערכת?</h2>
                        <button type="button" className="btn-link-edit" onClick={() => setIsAddingTechModalOpen(true)}>
                            הוסף טכנולוגיה חדשה
                        </button>
                    </div>
                    <div className="form-section">
                        <h2 className="form-subtitle">רוצה לעדכן את מסמך הפרויקט?</h2>
                        <button
                            type="button"
                            className="btn-link-edit"
                            onClick={() => navigate("/students/UpFile")}
                        >
                            העלה מסמך
                        </button>
                    </div>

                    <div className="button-container">
                        <button className="primary-button" onClick={handleSave}>שמור</button>
                        <button className="secondary-button" onClick={handleCancel}>ביטול</button>
                    </div>
                </div>
            </div>

            {isAddingTechModalOpen && (
                <Modal onClose={() => setIsAddingTechModalOpen(false)} width="40vw">
                    <AddTechnology
                        onBackToProject={() => {
                            setIsAddingTechModalOpen(false);
                            (async () => {
                                try {
                                    const techResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/technology/`, {
                                        method: "GET",
                                        credentials: "include",
                                    });
                                    const techData = await techResponse.json();
                                    if (techResponse.ok && techData.success) setTechnologies(techData.data);
                                } catch (err) {
                                    showNotification("שגיאה בטעינת הטכנולוגיות", "error");
                                }
                            })();
                        }}
                        showNotification={showNotification}
                    />
                </Modal>
            )}
        </div>
    );
};

export default EditProject;
