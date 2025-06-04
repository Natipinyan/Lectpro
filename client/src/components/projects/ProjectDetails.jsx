import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/projects/ProjectDetails.css";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/getOneProject/${projectId}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error("שגיאה בטעינת פרטי הפרויקט");
                }

                const data = await response.json();
                console.log("פרטי הפרויקט:", data);
                setProject(data);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError("אירעה שגיאה בטעינת פרטי הפרויקט");
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (loading) {
        return (
            <div className="project-details-wrapper">
                <div className="loading">טוען...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-details-wrapper">
                <div className="error">{error}</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-wrapper">
                <div className="no-project">הפרויקט לא נמצא</div>
            </div>
        );
    }

    return (
        <div className="project-details-wrapper">
            <button className="back-button" onClick={() => navigate(-1)}>
                חזור לרשימת הפרויקטים
            </button>
            <div className="project-details-container">
                <h2 className="project-title">{project.title || "פרויקט ללא שם"}</h2>
                <div className="project-description">
                    <strong>תיאור:</strong> {project.description || "ללא תיאור"}
                </div>
                <div className="project-github">
                    <strong>לינק לגיטהאב:</strong>{" "}
                    {project.githubLink ? (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                            {project.githubLink}
                        </a>
                    ) : (
                        "ללא לינק לגיטהאב"
                    )}
                </div>
                <div className="project-technologies">
                    <strong>טכנולוגיות בשימוש:</strong>{" "}
                    {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                        <ul>
                            {project.technologies.map((tech, index) => (
                                <li key={index}>{tech}</li>
                            ))}
                        </ul>
                    ) : (
                        "לא צוינו טכנולוגיות"
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProjectDetails;