import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "../projects/NotificationPopup";
import "../../css/projects/ProjectDetails.css";
import Swal from 'sweetalert2';

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
                const resProject = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/${projectId}`, {
                    method: "GET",
                    credentials: 'include',
                });
                const dataProject = await resProject.json();
                if (!resProject.ok || !dataProject.success) throw new Error(dataProject.message || "שגיאה בטעינת פרטי הפרויקט");

                const resTech = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/${projectId}/technologies`, {
                    method: "GET",
                    credentials: 'include',
                });
                const techData = await resTech.json();
                if (!resTech.ok || !techData.success) throw new Error(techData.message || "שגיאה בטעינת טכנולוגיות");

                let newPdfUrl = null;
                const resPdf = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/${projectId}/file`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (resPdf.ok) {
                    const pdfBlob = await resPdf.blob();
                    newPdfUrl = URL.createObjectURL(pdfBlob);
                } else if (resPdf.status !== 404) {
                    throw new Error("שגיאה בטעינת קובץ ה-PDF");
                }

                setProject({ ...dataProject.data, technologies: techData.data, notes: dataProject.data.notes || "אין הערות" });
                setPdfUrl(newPdfUrl);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError(err.message || "אירעה שגיאה בטעינת פרטי הפרויקט או ה-PDF");
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
        try {
            const result = await Swal.fire({
                title: 'האם אתה בטוח?',
                text: 'מחיקת הפרויקט היא פעולה בלתי הפיכה. האם ברצונך להמשיך?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff4d4f',
                cancelButtonColor: '#7494ec',
                confirmButtonText: 'כן, מחק',
                cancelButtonText: 'בטל',
                reverseButtons: true,
                customClass: {
                    popup: 'swal2-rtl',
                },
            });

            if (result.isConfirmed) {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/${projectId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'שגיאה במחיקת הפרויקט');
                }

                await Swal.fire({
                    title: 'נמחק בהצלחה!',
                    text: 'הפרויקט נמחק בהצלחה.',
                    icon: 'success',
                    confirmButtonText: 'אישור',
                    confirmButtonColor: '#28a745',
                });

                navigate('/students/MyProjects');
            }
        } catch (err) {
            console.error('שגיאה במחיקה:', err);
            await Swal.fire({
                title: 'שגיאה!',
                text: err.message || 'אירעה שגיאה במחיקת הפרויקט',
                icon: 'error',
                confirmButtonText: 'אישור',
                confirmButtonColor: '#ff4d4f',
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