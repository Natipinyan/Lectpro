import React, { useEffect, useRef, useState } from "react";
import styles from "../../css/projects/upFile.module.css";
import NotificationPopup from "./NotificationPopup";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("גרור קובץ לכאן או לחץ לבחירה");
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            showNotification("אנא בחר קובץ PDF בלבד.", "error");
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
    };

    const handleUpload = async () => {
        if (!file) {
            showNotification("אנא בחר קובץ לפני השליחה.", "error");
            return;
        }
        if (!selectedProject) {
            showNotification("אנא בחר פרויקט לפני השליחה.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectTitle", selectedProject.id);

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/upload/addFile`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                showNotification("הקובץ נשלח בהצלחה!", "success");
                setFile(null);
                setFileName("גרור קובץ לכאן או לחץ לבחירה");
                setSelectedProject(null);
            } else {
                showNotification("אירעה שגיאה בשליחת הקובץ.", "error");
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            showNotification("שגיאת רשת בשליחת הקובץ.", "error");
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/list`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("שגיאה בטעינת הפרויקטים");
                }

                const data = await response.json();
                setProjects(data || []);
                setLoading(false);
                if (!data || data.length === 0) {
                    showNotification("לא נמצאו פרויקטים", "info");
                }
            } catch (err) {
                console.error("שגיאה:", err);
                showNotification("אירעה שגיאה בטעינת הפרויקטים", "error");
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className={styles["upload-page-wrapper"]}>
            <h1 className={styles["main-title"]}>העלאת מסמך הפרויקט</h1>
            <div className={styles["content-wrapper"]}>
                <div className={styles["upload-section"]}>
                    <h2 className={styles["formLabel"]}>בחירת מסמך</h2>
                    <div
                        className={styles["upload-container"]}
                        id="upload-container"
                        onDragOver={handleDragOver}
                        onClick={handleClick}
                    >
                        <input
                            type="file"
                            name="file"
                            id="file-input"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                        <div className={styles["upload-icon"]}>
                            <i className="fas fa-upload"></i>
                        </div>
                        <div className={styles["upload-text"]} id="upload-text">
                            {fileName}
                        </div>
                    </div>
                </div>
                <div className={styles["project-section"]}>
                    <h2 className={styles["formLabel"]}>בחר לאיזה פרויקט לשייך את המסמך</h2>
                    {loading ? (
                        <div className={styles["loading"]}>טוען...</div>
                    ) : (
                        <div className={styles["projects-container"]}>
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`${styles["project-item"]} ${selectedProject?.id === project.id ? styles["selected"] : ""}`}
                                    onClick={() => handleProjectSelect(project)}
                                >
                                    <div className={styles["project-text"]}>
                                        <div className={styles["project-name"]}>
                                            {project.title || "פרויקט ללא שם"}
                                        </div>
                                        <div className={styles["project-description"]}>
                                            {project.description || "ללא תיאור"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles["footer-wrapper"]}>
                {selectedProject && (
                    <div className={styles["selected-project"]}>
                        פרויקט נבחר: <strong>{selectedProject.title}</strong>
                    </div>
                )}
                <button onClick={handleUpload} className={styles["upload-submit-btn"]}>
                    שלח קובץ
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

export default UploadFile;