import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/projects/upFile.module.css'; // יבוא CSS Modules

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("גרור קובץ לכאן או לחץ לבחירה");
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

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
            alert("אנא בחר קובץ PDF בלבד.");
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
            alert("אנא בחר קובץ לפני השליחה.");
            return;
        }
        if (!selectedProject) {
            alert("אנא בחר פרויקט לפני השליחה.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectTitle', selectedProject.id);

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/upload/addFile`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert("הקובץ נשלח בהצלחה!");
                setFile(null);
                setFileName("גרור קובץ לכאן או לחץ לבחירה");
                setSelectedProject(null);
            } else {
                alert("אירעה שגיאה בשליחת הקובץ.");
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            alert("שגיאת רשת בשליחת הקובץ.");
        }
    };

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

    return (
        <div className={styles['upload-page-wrapper']}>
            <h1 className={styles['main-title']}>העלאת מסמך הפרויקט</h1>
            <div className={styles['content-wrapper']}>
                <div className={styles['upload-section']}>
                    <h2 className={styles['formLabel']}>בחירת מסמך</h2>
                    <div
                        className={styles['upload-container']}
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
                        <div className={styles['upload-icon']}>
                            <i className="fas fa-upload"></i>
                        </div>
                        <div className={styles['upload-text']} id="upload-text">
                            {fileName}
                        </div>
                    </div>
                </div>
                <div className={styles['project-section']}>
                    <h2 className={styles['formLabel']}>בחר לאיזה פרויקט לשייך את המסמך</h2>
                    {loading ? (
                        <div className={styles['loading']}>טוען...</div>
                    ) : error ? (
                        <div className={styles['error']}>{error}</div>
                    ) : (
                        <div className={styles['projects-container']}>
                            {projects.length === 0 ? (
                                <div className={styles['no-projects']}>לא נמצאו פרויקטים</div>
                            ) : (
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className={`${styles['project-item']} ${selectedProject?.id === project.id ? styles['selected'] : ''}`}
                                        onClick={() => handleProjectSelect(project)}
                                    >
                                        <div className={styles['project-text']}>
                                            <div className={styles['project-name']}>
                                                {project.title || "פרויקט ללא שם"}
                                            </div>
                                            <div className={styles['project-description']}>
                                                {project.description || "ללא תיאור"}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles['footer-wrapper']}>
                {selectedProject && (
                    <div className={styles['selected-project']}>
                        פרויקט נבחר: <strong>{selectedProject.title}</strong>
                    </div>
                )}
                <button onClick={handleUpload} className={styles['upload-submit-btn']}>
                    שלח קובץ
                </button>
            </div>
        </div>
    );
};

export default UploadFile;