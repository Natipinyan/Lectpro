import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/projects/upFile.module.css";
import NotificationPopup from "./NotificationPopup";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("גרור קובץ לכאן או לחץ לבחירה");
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const selectedFile = e.dataTransfer.files[0];
        if (!selectedFile) return;
        if (selectedFile.type !== "application/pdf") {
            showNotification("אנא בחר קובץ PDF בלבד.", "error");
            return;
        }
        setFile(selectedFile);
        setFileName(selectedFile.name);
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
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/upload/${selectedProject.id}/file`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (response.ok && data.success) {
                showNotification("הקובץ נשלח בהצלחה! הנך מועבר לדף הבית", "success");
                setFile(null);
                setFileName("גרור קובץ לכאן או לחץ לבחירה");
                setSelectedProject(null);
                setTimeout(() => {
                    navigate("/students/HomeStudent");
                }, 2000);
            } else {
                showNotification(data.message || "אירעה שגיאה בשליחת הקובץ.", "error");
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            showNotification("שגיאת רשת בשליחת הקובץ.", "error");
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/projects/`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setProjects(data.data || []);
                    setLoading(false);
                    if (!data.data || data.data.length === 0) {
                        showNotification("לא נמצאו פרויקטים", "info");
                    }
                } else {
                    showNotification(data.message || "אירעה שגיאה בטעינת הפרויקטים", "error");
                    setLoading(false);
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
                        className={`${styles["upload-container"]} ${isDragging ? styles["dragging"] : ""}`}
                        id="upload-container"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    >
                        <input
                            type="file"
                            name="file"
                            id="file-input"
                            ref={fileInputRef}
                            className={styles["file-input"]}
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
                                    className={`${styles["project-item"]} ${
                                        selectedProject?.id === project.id ? styles["selected"] : ""
                                    }`}
                                    onClick={() => handleProjectSelect(project)}
                                >
                                    <div className={styles["project-text"]}>
                                        <div className={styles["project-name"]}>
                                            {project.title || "פרויקט ללא שם"}
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