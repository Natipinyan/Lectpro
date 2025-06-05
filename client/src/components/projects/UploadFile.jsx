import React, { useEffect, useRef, useState } from "react";
import '../../css/projects/upFile.css';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("גרור קובץ לכאן או לחץ לבחירה");
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null); // מצב לפרויקט שנבחר
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
        formData.append('file',  file);  // שולח את הקובץ
        formData.append('projectTitle',  selectedProject.title);  // שולח את הקובץ

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
        <>
            <h2 className="formLabel">:העלאת מסמך הפרוייקט</h2>
            <div className="upload-wrapper">
                <div
                    className="upload-container"
                    id="upload-container"
                    onDragOver={handleDragOver}
                    onClick={handleClick}
                >
                    <input
                        type="file"
                        name=  "file"
                        id="file-input"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    <div className="upload-icon"></div>
                    <div className="upload-text" id="upload-text">
                        {fileName}
                    </div>
                </div>

                <h2 className="formLabel">בחר לאיזה פרויקט תרצה לשייך את המסמך שלך</h2>
                <div className="projects-wrapper">
                    {loading ? (
                        <div className="loading">טוען...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="projects-container">
                            {projects.length === 0 ? (
                                <div className="no-projects">לא נמצאו פרויקטים</div>
                            ) : (
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                                        onClick={() => handleProjectSelect(project)}
                                    >
                                        <div className="project-text">
                                            <div className="project-name">
                                                {project.title || "פרויקט ללא שם"}
                                            </div>
                                            <div className="project-description">
                                                {project.description || "ללא תיאור"}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {selectedProject && (
                    <div className="selected-project">
                        פרויקט נבחר: <strong>{selectedProject.title}</strong>
                    </div>
                )}

                <button onClick={handleUpload} className="upload-submit-btn">
                    שלח קובץ
                </button>
            </div>
        </>
    );
};

export default UploadFile;