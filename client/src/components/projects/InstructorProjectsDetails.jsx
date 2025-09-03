import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "../projects/NotificationPopup";
import AddNote from "./AddNote";
import CommentsProject from "./CommentsProject";
import Modal from "../base/Modal";
import "../../css/projects/ProjectDetails.css";
import axios from "axios";
import Grades from "./grades";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [notification, setNotification] = useState(null);
    const [showAddNote, setShowAddNote] = useState(false);

    const [commentsSummary, setCommentsSummary] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);
    const [showComments, setShowComments] = useState(false);

    const [department, setDepartment] = useState(null);


    const fetchProjectDetails = async () => {
        try {
            const resProject = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/ins/${projectId}`, {
                method: "GET",
                credentials: 'include',
            });
            const dataProject = await resProject.json();
            if (!resProject.ok || !dataProject.success) {
                throw new Error(dataProject.message || "שגיאה בטעינת פרטי הפרויקט");
            }

            const resTech = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/ins/${projectId}/technologies`, {
                method: "GET",
                credentials: 'include',
            });
            const techData = await resTech.json();
            if (!resTech.ok || !techData.success) {
                throw new Error(techData.message || "שגיאה בטעינת טכנולוגיות");
            }

            let newPdfUrl = null;
            const resPdf = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/ins/${projectId}/file`, {
                method: "GET",
                credentials: 'include',
            });

            if (resPdf.ok) {
                const pdfBlob = await resPdf.blob();
                newPdfUrl = URL.createObjectURL(pdfBlob);
            } else if (resPdf.status !== 404) {
                throw new Error("שגיאה בטעינת קובץ ה-PDF");
            }

            setProject({
                ...dataProject.data,
                technologies: techData.data,
                notes: dataProject.data.notes || "אין הערות",
            });
            setPdfUrl(newPdfUrl);
            setLoading(false);
        } catch (err) {
            console.error("שגיאה:", err);
            setError(err.message || "אירעה שגיאה בטעינת פרטי הפרויקט או ה-PDF");
            setLoading(false);
        }
    };

    const fetchCommentsSummary = async () => {
        try {
            setCommentsLoading(true);
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/comments/ins/project/${projectId}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "שגיאה בטעינת הערות");
            }
            setCommentsSummary(data.data);
        } catch (err) {
            console.error("שגיאה בטעינת הערות:", err);
            setCommentsError(err.message);
        } finally {
            setCommentsLoading(false);
        }
    };

    const departmentName = async function fetchDepartment() {
        try {
            const res = await axios.get("http://localhost:5000/departments", { withCredentials: true });
            if (res.data && res.data.data) {
                setDepartment(res.data.data);
            }
        } catch (err) {
            console.error("שגיאה בטעינת המגמה:", err);
        }
    }

    useEffect(() => {
        departmentName();
        fetchProjectDetails();
        fetchCommentsSummary();
    }, [projectId]);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleSaveNote = async (noteData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    project_id: projectId,
                    title: noteData.title,
                    section: noteData.section,
                    page: noteData.page,
                    text: noteData.text,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setNotification({ message: "ההערה נשמרה בהצלחה!", type: "success" });

                await fetchCommentsSummary();
                await fetchProjectDetails();

            } else {
                setNotification({ message: data.message || "שגיאה בשמירת ההערה", type: "error" });
            }
        } catch (error) {
            console.error("שגיאה בשמירת הערה:", error);
            setNotification({ message: "שגיאה בתקשורת עם השרת", type: "error" });
        } finally {
            setShowAddNote(false);
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

            <div className="project-header">
                <h2 className="project-title-label">פרטי הפרויקט</h2>
                {department && (
                    <h2 className="department-name">{department.name}</h2>
                )}
            </div>

            <div className="project-main">
                <div className="project-grades-top">
                    <Grades projectId={projectId} user="ins" />
                </div>
                <div className="project-grades-button">
                    <div className="content-wrapper">
                        <div className="right-column">
                            <div className="project-details-container">
                                <div className="button-container">
                                    <button className="back-button" onClick={() => navigate(-1)}>
                                        חזרה לכל הפרוייקטים
                                    </button>
                                </div>

                                <div className="project-title">{project.title}</div>
                                <div className="project-description">{project.description}</div>

                                <div className="project-github">
                                    <div>קישור לגיטהאב</div>
                                    {project.link_to_github ? (
                                        <a href={project.link_to_github} target="_blank" rel="noopener noreferrer">
                                            {project.link_to_github}
                                        </a>
                                    ) : (
                                        <span>לא הוזן קישור לגיטהאב</span>
                                    )}
                                </div>

                                {project.technologies?.length > 0 && (
                                    <div className="project-technologies">
                                        <h4>טכנולוגיות בפרויקט:</h4>
                                        <ul>
                                            {project.technologies.map((tech) => (
                                                <li key={tech.id}>
                                                    {tech.language} {tech.language && `(${tech.title})`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="notes-container">
                                {commentsLoading ? (
                                    <div>טוען סיכום הערות...</div>
                                ) : commentsError ? (
                                    <div className="error">{commentsError}</div>
                                ) : commentsSummary ? (
                                    <>
                                        <h4>סה"כ הערות: </h4>
                                        <div>בוצעו והושלמו: {commentsSummary.doneAndCompleted?.length || 0}</div>
                                        <div>בוצעו וממתינים לאישור: {commentsSummary.doneButNotCompleted?.length || 0}</div>
                                        <div>ממתינים לטיפול: {commentsSummary.notDone?.length || 0}</div>

                                        <div className="button-container" style={{ marginTop: "10px", justifyContent: "space-between" }}>
                                            <button onClick={() => setShowComments(true)}>תצוגה מפורטת</button>
                                            <button className="add-note-button" onClick={() => setShowAddNote(true)}>➕ הוסף הערה</button>
                                        </div>
                                    </>
                                ) : (
                                    <div>אין הערות לפרויקט זה</div>
                                )}

                                {!commentsLoading && !commentsError && commentsSummary?.totalCount === 0 && (
                                    <div className="button-container" style={{ marginTop: "10px" }}>
                                        <button className="back-button" onClick={() => setShowAddNote(true)}>➕ הוסף הערה</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pdfView">
                            {pdfUrl ? (
                                <iframe src={pdfUrl} title="Project PDF" className="pdf-iframe" />
                            ) : (
                                <div className="no-pdf-message">לפרויקט זה לא נוסף מסמך</div>
                            )}
                        </div>
                    </div>


                </div>
            </div>


            {showComments && (
                <Modal onClose={() => setShowComments(false)} width="70vw">
                    <CommentsProject comments={commentsSummary} nav="instructor" />
                </Modal>
            )}

            {showAddNote && (
                <Modal onClose={() => setShowAddNote(false)} width="40vw">
                    <AddNote
                        projectTitle={project.title}
                        onClose={() => setShowAddNote(false)}
                        onSave={handleSaveNote}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ProjectDetails;