import React, { useState, useEffect } from "react";
import NotificationPopup from "./NotificationPopup";
import AddTechnology from "./AddTech";
import Modal from "../base/Modal";
import { useNavigate } from "react-router-dom";
import '../../css/projects/openProject.css';

const OpenPro = () => {
    const navigate = useNavigate();
    const [isAddingTechModalOpen, setIsAddingTechModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [projectData, setProjectData] = useState({
        projectName: "",
        projectDesc: "",
        linkToGithub: "",
        selectedTechs: [],
    });
    const [technologies, setTechnologies] = useState([]);

    const showNotification = (message, type) => setNotification({ message, type });
    const closeNotification = () => setNotification({ message: "", type: "" });

    const updateProjectData = (newData) => setProjectData((prev) => ({ ...prev, ...newData }));
    const resetProjectData = () => setProjectData({
        projectName: "",
        projectDesc: "",
        linkToGithub: "",
        selectedTechs: [],
    });

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/technology/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.success) setTechnologies(data.data);
                else showNotification(data.message || "אירעה שגיאה בטעינת הטכנולוגיות", "error");
            } catch (err) {
                console.error(err);
                showNotification("שגיאה בחיבור לשרת", "error");
            }
        };
        fetchTechnologies();
    }, []);

    const toggleTechnology = (tech) => {
        const isSelected = projectData.selectedTechs.some(s => s.id === String(tech.id));
        const updatedTechs = isSelected
            ? projectData.selectedTechs.filter(s => s.id !== String(tech.id))
            : [...projectData.selectedTechs, { id: String(tech.id), techType: tech.title, language: tech.language || "" }];
        updateProjectData({ selectedTechs: updatedTechs });
    };

    const validateGithubLink = (link) => !link || /^https:\/\/github\.com\/.+$/.test(link);

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
        const validTechs = projectData.selectedTechs.filter(t => t.id && t.techType);
        if (validTechs.length === 0) {
            showNotification("יש לבחור לפחות טכנולוגיה אחת", "error");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/`, {
                method: "POST",
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
                showNotification("הפרויקט נוסף בהצלחה! מעביר אותך לדף העלאת מסמך", "success");
                resetProjectData();
                setTimeout(() => navigate("/students/UpFile"), 3000);
            } else {
                showNotification(data.message || "אירעה שגיאה", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("שגיאה בחיבור לשרת", "error");
        }
    };

    return (
        <>
            {notification.message && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}

            <div className="open-pro-wrapper">
                <form className="form-container" onSubmit={handleSubmit}>
                    <h1 className="form-title">פתיחת פרוייקט</h1>
                    <div className="secLeft">
                        <div className="form-section">
                            <label className="form-label">שם הפרויקט</label>
                            <input
                                className="text-input"
                                value={projectData.projectName}
                                onChange={e => updateProjectData({ projectName: e.target.value })}
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
                                onChange={e => updateProjectData({ projectDesc: e.target.value })}
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
                                onChange={e => updateProjectData({ linkToGithub: e.target.value })}
                                placeholder="https://github.com/example/repo"
                            />
                        </div>
                    </div>

                    <div className="secRight">
                        <div className="form-section">
                            <label className="form-label">בחר טכנולוגיות</label>
                            <div className="tech-chips-container">
                                {technologies.map(tech => {
                                    const isSelected = projectData.selectedTechs.some(s => s.id === String(tech.id));
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
                                className="btn-link-edit"
                                onClick={() => setIsAddingTechModalOpen(true)}
                            >
                                הוסף טכנולוגיה חדשה
                            </button>
                        </div>
                        <div className="form-section">
                            <h2 className="form-subtitle">
                               לאחר יצירת הפרויקט בהצלחה תועבר לדף העלאת המסמך
                            </h2>
                        </div>


                        <div className="button-container">
                            <button className="primary-button" type="submit">
                                צור פרויקט
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {isAddingTechModalOpen && (
                <Modal onClose={() => setIsAddingTechModalOpen(false)} width="40vw">
                    <h1 className="form-title">יצירת טכנולוגיות</h1>
                    <AddTechnology
                        onBackToProject={() => setIsAddingTechModalOpen(false)}
                        showNotification={showNotification}
                    />
                </Modal>
            )}
        </>
    );
};

export default OpenPro;
