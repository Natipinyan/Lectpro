import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/projects/ProjectDetails.css";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

                setProject({ ...dataProject, technologies: techData });
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

    if (loading) return <div className="loading">טוען פרטי פרויקט...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!project) return <div className="no-project">לא נמצא פרויקט</div>;

    return (
        <div className="project-details-wrapper">
            <div className="project-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>חזור</button>
                <div className="project-title">{project.title}</div>
                <div className="project-description">{project.description}</div>
                <div className="project-github">
                    <div>קישור לגיטהאב</div>
                    {project.link_to_github != null ? (
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
                                    {tech.title} {tech.language && (`${tech.language}`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="pdfView">
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        title="Project PDF"
                        style={{ width: "100%", height: "500px", border: "none" }}
                    />
                ) : (
                    <div className="no-pdf-message">לפרויקט זה לא נוסף מסמך</div>
                )}
            </div>

        </div>
    );
};

export default ProjectDetails;