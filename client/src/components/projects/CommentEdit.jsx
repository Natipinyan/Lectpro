import React, { useState } from "react";
import '../../css/projects/CommentEdit.css'

const CommentEdit = ({ comment, onClose, onSaveSuccess }) => {
    const [title, setTitle] = useState(comment.title || "");
    const [section, setSection] = useState(comment.section || "");
    const [page, setPage] = useState(comment.page || "");
    const [text, setText] = useState(comment.text || "");

    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const validate = () => {
        if (!title.trim()) return "כותרת היא שדה חובה";
        if (!section.trim()) return "סעיף הוא שדה חובה";
        if (!page || isNaN(page)) return "מספר עמוד חייב להיות מספר";
        if (!text.trim()) return "תוכן ההערה הוא שדה חובה";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        setSaving(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/comments/${comment.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        title,
                        section,
                        page: Number(page),
                        text,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                onSaveSuccess && onSaveSuccess({
                    id: comment.id,
                    title,
                    section,
                    page: Number(page),
                    text,
                });
                onClose();
            } else {
                setError(data.message || "שגיאה בעדכון ההערה");
            }

        } catch (err) {
            setError("שגיאה בתקשורת עם השרת");
        } finally {
            setSaving(false);
        }
    };

    return (
            <div className="comment-edit-container">
                <h3>עריכת הערה</h3>

                {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

                <label>כותרת הערה:</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>סעיף הערה:</label>
                <input value={section} onChange={(e) => setSection(e.target.value)} />

                <label>מספר עמוד במסמך:</label>
                <input
                    type="number"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    min={1}
                />

                <label>תוכן ההערה:</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} />

                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <button onClick={onClose} disabled={saving}>
                        ביטול
                    </button>
                    <button onClick={handleSubmit} disabled={saving}>
                        {saving ? "שומר..." : "שמור"}
                    </button>
                </div>
            </div>
    );
};

export default CommentEdit;
