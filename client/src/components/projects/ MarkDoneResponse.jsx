import React, { useState } from "react";
import '../../css/projects/ MarkDoneResponse.css'

const MarkDoneResponse = ({ onClose, onSend }) => {
    const [responseText, setResponseText] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!responseText.trim()) {
            setError("יש להזין תגובה");
            return;
        }
        setError(null);
        setSending(true);

        try {
            await onSend(responseText);
        } catch (err) {
            setError(err.message || "שגיאה בשליחת התגובה");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="mark-done-response-container">
            <h3>תגובה להערה</h3>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <textarea
                rows={5}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="כתוב את תגובתך כאן..."
            />
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={onClose} disabled={sending}>ביטול</button>
                <button onClick={handleSubmit} disabled={sending}>
                    {sending ? "שולח..." : "שלח"}
                </button>
            </div>
        </div>
    );
};

export default MarkDoneResponse;
