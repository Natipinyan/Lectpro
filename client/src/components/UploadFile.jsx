import React, { useRef, useState } from "react";
import "../css/uploadFile.css";

const UploadFile = () => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("גרור ושחרר את הקובץ כאן או לחץ לבחירה");

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("גרור ושחרר את הקובץ כאן או לחץ לבחירה");
        }
    };

    const validateForm = (event) => {
        const file = fileInputRef.current.files[0];
        const projectName = document.getElementById("project-name").value.trim();
        const projectDesc = document.getElementById("project-desc").value.trim();

        if (!projectName || !projectDesc) {
            alert("יש למלא את כל השדות.");
            event.preventDefault();
            return;
        }

        if (!file) {
            alert("יש לבחור קובץ לפני ההעלאה.");
            event.preventDefault();
        }
    };

    return (
        <div>
            <h1 className="upMessage">:יצירת פרוייקט חדש</h1>
            <form
                id="upload-form"
                action="http://localhost:5000/upload/addFile"
                method="post"
                encType="multipart/form-data"
                onSubmit={validateForm}
            >
                <div className="form-section">
                    <label htmlFor="project-name" className="formLabel">:שם הפרוייקט</label>
                    <input type="text" id="project-name" name="projectName" className="text-input" required />
                </div>

                <div className="form-section">
                    <label htmlFor="project-desc" className="formLabel">:תיאור הפרוייקט</label>
                    <textarea id="project-desc" name="projectDesc" className="text-area" rows="4" required />
                </div>

                <h2 className="formLabel">:העלאת מסמך הפרוייקט</h2>
                <div
                    className="upload-container"
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
                        onChange={handleFileChange}
                    />
                    <div className="upload-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6c63ff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <div className="upload-text" id="upload-text">
                        {fileName}
                    </div>
                </div>

                <div className="button-container">
                    <button className="button" id="toUploadPage" type="submit">
                        ליצירת הפרוייקט
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadFile;
