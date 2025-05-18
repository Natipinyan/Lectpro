import React from "react";
const Upload = () => {
    return (
        <>
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

        </>
    )

}

