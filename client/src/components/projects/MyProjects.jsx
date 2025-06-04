import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/projects/ProjectList.css";

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/list`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error("שגיאה בטעינת הפרויקטים");
                }

                const data = await response.json();
                setProjects(data || []);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה:", err);
                setError("אירעה שגיאה בטעינת הפרויקטים");
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (projectId) => {
        navigate(`/students/project/${projectId}`)
    };

    if (loading) {
        return (
            <div className="projects-wrapper">
                <h2 className="formLabel">רשימת הפרויקטים שלך</h2>
                <div className="loading">טוען...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-wrapper">
                <h2 className="formLabel">רשימת הפרויקטים שלך</h2>
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <>
            <h2 className="formLabel">רשימת הפרויקטים שלך</h2>
            <div className="projects-wrapper">
                <div className="projects-container">
                    {projects.length === 0 ? (
                        <div className="no-projects">לא נמצאו פרויקטים</div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="project-item">
                                <div className="project-text">
                                    <div className="project-name">
                                        {project.title || "פרויקט ללא שם"}
                                    </div>
                                    <div className="project-description">
                                        {project.description || "ללא תיאור"}
                                    </div>
                                </div>
                                <button
                                    className="project-button"
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    {project.title || "צפה בפרויקט"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default ProjectList;