import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/projects/ProjectList.module.css";

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
        navigate(`/students/project/${projectId}`);
    };

    if (loading) {
        return (
            <div className={styles['page-wrapper']}>
                <h2 className={styles['formLabel']}>רשימת הפרויקטים שלך</h2>
                <div className={styles['projects-container']}>
                    <div className={styles['loading']}>טוען...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['page-wrapper']}>
                <h2 className={styles['formLabel']}>רשימת הפרויקטים שלך</h2>
                <div className={styles['projects-container']}>
                    <div className={styles['error']}>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['page-wrapper']}>
            <h2 className={styles['formLabel']}>רשימת הפרויקטים שלך</h2>
            <div className={styles['projects-container']}>
                {projects.length === 0 ? (
                    <div className={styles['no-projects']}>לא נמצאו פרויקטים</div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className={styles['project-item']}>
                            <div className={styles['project-text']}>
                                <div className={styles['project-name']}>
                                    {project.title || "פרויקט ללא שם"}
                                </div>
                            </div>
                            <button
                                className={styles['project-button']}
                                onClick={() => handleProjectClick(project.id)}
                            >
                                {"צפה בפרויקט"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectList;