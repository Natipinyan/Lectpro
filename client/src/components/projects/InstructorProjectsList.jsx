import React, { useEffect, useState } from "react";
import styles from "../../css/projects/ProjectList.module.css";
import { useNavigate } from "react-router-dom";

const InstructorProjectsList = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setProjects(data.data || []);
            } else {
                setError(data.message || "אירעה שגיאה בטעינת הפרויקטים");
            }
        } catch (err) {
            console.error("שגיאה:", err);
            setError("אירעה שגיאה בטעינת הפרויקטים");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className={styles["page-wrapper"]}>
            <h2 className={styles["formLabel"]}>רשימת הפרויקטים שלי כמנחה</h2>

            {loading ? (
                <div className={styles["projects-container"]}>
                    <div className={styles["loading"]}>טוען...</div>
                </div>
            ) : error ? (
                <div className={styles["projects-container"]}>
                    <div className={styles["error"]}>{error}</div>
                </div>
            ) : (
                <div className={styles["projects-container"]}>
                    {projects.length === 0 ? (
                        <div className={styles["no-projects"]}>לא נמצאו פרויקטים להצגה</div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className={styles["project-item"]}>
                                <div className={styles["project-text"]}>
                                    <div className={styles["project-name"]}>
                                        {project.title || "פרויקט ללא שם"}
                                    </div>


                                    <>
                                        {(project.student1_first_name || project.student1_last_name) && (
                                            <div style={{ marginTop: "8px", fontStyle: "italic", color: "#555" }}>
                                                סטודנט 1:{" "}
                                                {project.student1_first_name && project.student1_last_name
                                                    ? `${project.student1_first_name} ${project.student1_last_name}`
                                                    : "לא זמין"}
                                            </div>
                                        )}

                                        {(project.student2_first_name || project.student2_last_name) && (
                                            <div style={{ marginTop: "4px", fontStyle: "italic", color: "#555" }}>
                                                סטודנט 2:{" "}
                                                {project.student2_first_name && project.student2_last_name
                                                    ? `${project.student2_first_name} ${project.student2_last_name}`
                                                    : "לא זמין"}
                                            </div>
                                        )}

                                        {!(
                                            (project.student1_first_name || project.student1_last_name) ||
                                            (project.student2_first_name || project.student2_last_name)
                                        ) && (
                                            <div style={{ marginTop: "8px", fontStyle: "italic", color: "#555" }}>
                                                סטודנטים: לא זמין
                                            </div>
                                        )}
                                    </>

                                </div>

                                <button
                                    className={styles['project-button']}
                                    onClick={() => navigate(`/instructor/project/${project.id}`)}
                                >
                                    צפה בפרויקט
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default InstructorProjectsList;
