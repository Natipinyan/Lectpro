import React, { useState } from "react";
import "../../css/projects/AddNote.css";

const AddNote = ({ projectTitle, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [section, setSection] = useState("");
    const [page, setPage] = useState("");
    const [text, setText] = useState("");

    const [error, setError] = useState("");

    const handleSaveNote = () => {
        if (!title.trim()) {
            setError("כותרת היא שדה חובה");
            return;
        }
        if (!section.trim()) {
            setError("סעיף במסמך הוא שדה חובה");
            return;
        }
        if (!page || isNaN(page)) {
            setError("מספר עמוד הוא שדה חובה וחייב להיות מספר");
            return;
        }
        if (!text.trim()) {
            setError("תוכן ההערה הוא שדה חובה");
            return;
        }

        setError("");
        onSave({
            title,
            section,
            page: Number(page),
            text,
        });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container-a">
                <h3 className="popup-title">{projectTitle}</h3>

                {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

                <label>סעיף במסמך:</label>
                <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                />

                <label>מספר עמוד במסמך:</label>
                <input
                    type="number"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                />

                <label>כותרת הערה:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>תוכן ההערה:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>

                <div className="popup-buttons">
                    <button onClick={onClose} className="cancel-btn">
                        ביטול
                    </button>
                    <button onClick={handleSaveNote} className="save-btn">
                        שמור
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
