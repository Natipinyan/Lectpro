import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "../projects/NotificationPopup";
import "../../css/projects/ProjectDetails.css";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const resProject = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/getOneProject/${projectId}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (!resProject.ok) throw new Error("שגיאה בטעינת פרטי הפרויקט");

                const dataProject = await resProject.json();

                const resTech = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/getProjectTechnologies/${projectId}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (!resTech.ok) throw new Error("שגיאה בטעינת טכנולוגיות");

                const techData = await resTech.json();

                let newPdfUrl = null;
                const resPdf = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/file/${projectId}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (resPdf.ok) {
                    const pdfBlob = await resPdf.blob();
                    newPdfUrl = URL.createObjectURL(pdfBlob);
                } else if (resPdf.status !== 404) {
                    throw new Error("שגיאה בטעינת קובץ ה-PDF");
                }

                setProject({ ...dataProject, technologies: techData, notes: dataProject.notes || "אין הערות" });
                setPdfUrl(newPdfUrl);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError("אירעה שגיאה בטעינת פרטי הפרויקט או ה-PDF");
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleEditClick = () => {
        navigate(`/students/editproject/${projectId}`);
    };

    const handleDeleteClick = async () => {
        // הוספת הודעת אישור
        if (!window.confirm("האם אתה בטוח שברצונך למחוק את הפרויקט? פעולה זו אינה ניתנת לביטול.")) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/deleteproject/${projectId}`, {
                method: "DELETE",
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "שגיאה במחיקת הפרויקט");
            }

            setNotification({
                message: "הפרויקט נמחק בהצלחה!",
                type: "success",
            });

            setTimeout(() => {
                navigate("/students/MyProjects");
            }, 3000);
        } catch (err) {
            console.error("שגיאה במחיקה:", err);
            setNotification({
                message: err.message || "אירעה שגיאה במחיקת הפרויקט",
                type: "error",
            });
        }
    };

    if (loading) {
        return (
            <div className="project-details-wrapper">
                <h2 className="formLabel">פרטי הפרויקט</h2>
                <div className="content-wrapper">
                    <div className="loading">טוען פרטי פרויקט...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-details-wrapper">
                <h2 className="formLabel">פרטי הפרויקט</h2>
                <div className="content-wrapper">
                    <div className="error">{error}</div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-wrapper">
                <h2 className="formLabel">פרטי הפרויקט</h2>
                <div className="content-wrapper">
                    <div className="no-project">לא נמצא פרויקט</div>
                </div>
            </div>
        );
    }

    return (
        <div className="project-details-wrapper">
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2 className="formLabel">פרטי הפרויקט</h2>
            <div className="content-wrapper">
                <div className="right-column">
                    <div className="project-details-container">
                        <div className="button-container">
                            <button className="back-button" onClick={() => navigate(-1)}>חזור</button>
                            <button className="edit-button" onClick={handleEditClick}>עריכה</button>
                            <button className="delete-button" onClick={handleDeleteClick}>מחיקה</button>
                        </div>
                        <div className="project-title">{project.title}</div>
                        <div className="project-description">{project.description}</div>
                        <div className="project-github">
                            <div>קישור לגיטהאב</div>
                            {project.link_to_github ? (
                                <span>
                                    <a href={project.link_to_github} target="_blank" rel="noopener noreferrer">
                                        {project.link_to_github}
                                    </a>
                                </span>
                            ) : (
                                <span>לא הוזן קישור לגיטהאב</span>
                            )}
                        </div>
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="project-technologies">
                                <h4>טכנולוגיות בפרויקט:</h4>
                                <ul>
                                    {project.technologies.map(tech => (
                                        <li key={tech.id}>
                                            {tech.language} {tech.language && `(${tech.title})`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="notes-container">
                        <h4>הערות</h4>
                        <div className="notes-content">{project.notes || "אין הערות"}</div>
                    </div>
                </div>
                <div className="pdfView">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="Project PDF"
                            className="pdf-iframe"
                        />
                    ) : (
                        <div className="no-pdf-message">לפרויקט זה לא נוסף מסמך</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;