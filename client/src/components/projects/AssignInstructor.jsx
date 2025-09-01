import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NotificationPopup from "./NotificationPopup";
import styles from "../../css/projects/AssignInstructor.module.css";

const AssignInstructor = () => {
    const [projects, setProjects] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/admin/projectsInsByDep`,
                { withCredentials: true }
            );

            const { projects: projectsData, instructors: instructorsData } = response.data;

            setProjects(projectsData || []);
            setInstructors(instructorsData || []);
            setLoading(false);

            if (!instructorsData || instructorsData.length === 0) {
                showNotification("לא נמצאו מרצים פעילים", "info");
            }
        } catch (err) {
            console.error("שגיאה בטעינת הנתונים:", err);
            showNotification("שגיאה בטעינת הנתונים", "error");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssign = async () => {
        if (!selectedProject || !selectedInstructor) {
            showNotification("אנא בחר פרויקט ומרצה לפני השמירה.", "error");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/admin/assignProjectInstructor`,
                {
                    projectId: selectedProject.id,
                    instructorId: selectedInstructor.id,
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                showNotification("הקישור נשמר בהצלחה!", "success");
                setSelectedProject(null);
                setSelectedInstructor(null);
                await fetchData();
            } else {
                showNotification(response.data.message || "שגיאה בשמירת הקישור.", "error");
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            showNotification("שגיאת רשת בשמירת הקישור.", "error");
        }
    };

    return (
        <div className={styles["assign-page-wrapper"]}>
            <h1 className={styles["main-title"]}>קישור מרצה לפרויקט</h1>
            <div className={styles["content-wrapper"]}>
                <div className={styles["project-section"]}>
                    <h2 className={styles["formLabel"]}>בחירת פרויקט</h2>
                    {loading ? (
                        <div className={styles["loading"]}>טוען...</div>
                    ) : projects.length === 0 ? (
                        <div className={styles["no-items"]}>לא נמצאו פרויקטים ללא מנחה</div>
                    ) : (
                        <div className={styles["items-container"]}>
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`${styles["item"]} ${
                                        selectedProject?.id === project.id ? styles["selected"] : ""
                                    }`}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className={styles["item-text"]}>
                                        <div className={styles["item-name"]}>
                                            {project.title || "פרויקט ללא שם"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {projects.length > 0 && (
                    <div className={styles["instructor-section"]}>
                        <h2 className={styles["formLabel"]}>בחירת מרצה</h2>
                        {loading ? (
                            <div className={styles["loading"]}>טוען...</div>
                        ) : instructors.length === 0 ? (
                            <div className={styles["no-items"]}>לא נמצאו מרצים פעילים</div>
                        ) : (
                            <div className={styles["items-container"]}>
                                {instructors.map((ins) => (
                                    <div
                                        key={ins.id}
                                        className={`${styles["item"]} ${
                                            selectedInstructor?.id === ins.id ? styles["selected"] : ""
                                        }`}
                                        onClick={() => setSelectedInstructor(ins)}
                                    >
                                        <div className={styles["item-text"]}>
                                            <div className={styles["item-name"]}>
                                                {ins.first_name} {ins.last_name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles["footer-wrapper"]}>
                {selectedProject && selectedInstructor && (
                    <div className={styles["selected-items"]}>
                        נבחר: <strong>{selectedProject.title}</strong> ו-
                        <strong>
                            {selectedInstructor.first_name} {selectedInstructor.last_name}
                        </strong>
                    </div>
                )}
                <button onClick={handleAssign} className={styles["assign-submit-btn"]}>
                    שמור קישור
                </button>
            </div>

            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );

};

export default AssignInstructor;
