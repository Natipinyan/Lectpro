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

                setProject({ ...dataProject, technologies: techData });
                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError("אירעה שגיאה בטעינת פרטי הפרויקט");
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (loading) return <div className="loading">טוען פרטי פרויקט...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!project) return <div className="no-project">לא נמצא פרויקט</div>;

    return (
        <div className="project-details-wrapper">
            <button className="back-button" onClick={() => navigate(-1)}>חזור</button>
            <div className="project-details-container">
                <div className="project-title">{project.title}</div>
                <div className="project-description">{project.description}</div>
                <div className="project-github">
                    קישור לגיטהאב:{" "}
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                        {project.github_link}
                    </a>
                </div>

                {project.technologies && project.technologies.length > 0 && (
                    <div className="project-technologies">
                        <h4>טכנולוגיות בפרויקט:</h4>
                        <ul>
                            {project.technologies.map(tech => (
                                <li key={tech.id}>
                                    {tech.title} {tech.language && `(${tech.language})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
