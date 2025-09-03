import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "../projects/NotificationPopup";
import CommentsProject from "./CommentsProject";
import Modal from "../base/Modal";
import "../../css/projects/ProjectDetails.css";
import Swal from 'sweetalert2';
import axios from "axios";
import Grades from "./grades";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [commentsSummary, setCommentsSummary] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [department, setDepartment] = useState(null);
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



        const fetchCommentsSummary = async () => {

            try {
                setCommentsLoading(true);
                const res = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/comments/project/${projectId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (!res.ok || !data.success)
                    throw new Error(data.message || "שגיאה בטעינת הערות");

                setCommentsSummary(data.data);
            } catch (err) {
                console.error("שגיאה בטעינת הערות:", err);
                setCommentsError(err.message);
            } finally {
                setCommentsLoading(false);
            }
        };


            const department = async function fetchDepartment() {
                try {
                    const res = await axios.get("http://localhost:5000/departments/std", { withCredentials: true });
                    if (res.data && res.data.data) {
                        setDepartment(res.data.data);
                    }
                } catch (err) {
                    console.error("שגיאה בטעינת המגמה:", err);
                }
            }

        department();
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
            <div>

            </div>
            <div className="project-header">
                <h2 className="project-title-label-de">פרטי הפרויקט</h2>
                {department && (
                    <h2 className="department-name-label-de">{department.name}</h2>
                )}
            </div>
            <div className="project-main">
                <div className="project-grades-top">
                    <Grades projectId={projectId} user="student" />
                </div>
                <div className="project-grades-button">
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
                                {commentsLoading ? (
                                    <div>טוען הערות...</div>
                                ) : commentsError ? (
                                    <div className="error">{commentsError}</div>
                                ) : commentsSummary ? (
                                    <>
                                        <h4>סה"כ הערות: </h4>
                                        <div>הערה בוצעה: {commentsSummary.doneAndCompleted?.length || 0}</div>
                                        <div>ממתין לתגובת מרצה: {commentsSummary.doneButNotCompleted?.length || 0}</div>
                                        <div>ממתין לתגובת סטודנט: {commentsSummary.notDone?.length || 0}</div>


                                        <div className="button-container" style={{ marginTop: "10px" }}>
                                            <button onClick={() => setShowComments(true)}>למעבר לתצוגה מפורטת</button>
                                        </div>
                                    </>
                                ) : (
                                    <div>אין הערות לפרויקט זה</div>
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

            {showComments && commentsSummary && (
                <Modal onClose={() => setShowComments(false)} width="70vw">
                    <CommentsProject comments={commentsSummary} nav={'students'}  />
                </Modal>
            )}
        </div>
    );
};

export default ProjectDetails;
