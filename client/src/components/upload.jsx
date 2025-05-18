import React, { useRef, useState } from "react";
import '../css/upFile.css'

const Upload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("גרור קובץ לכאן או לחץ לבחירה");
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
    const handleUpload = async () => {
        if (!file) {
            alert("אנא בחר קובץ לפני השליחה.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload/addFile", {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert("הקובץ נשלח בהצלחה!");
            } else {
                alert("אירעה שגיאה בשליחת הקובץ.");
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            alert("שגיאת רשת בשליחת הקובץ.");
        }
    };

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
                        name="file"
                        id="file-input"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    <div className="upload-icon">
                    </div>
                    <div className="upload-text" id="upload-text">
                        {fileName}
                    </div>
                </div>

                <button onClick={handleUpload} className="upload-submit-btn">
                    שלח קובץ
                </button>
            </div>
        </>

    );
};

export default Upload;
