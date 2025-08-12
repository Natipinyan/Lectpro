import React, { useState } from "react";
import '../../css/projects/ MarkDoneResponse.css';

const MarkDoneResponse = ({ commentId, onClose, onSendSuccess, onSendError }) => {
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
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/comments/${commentId}/userDone`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ user_response: responseText.trim() }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                onSendSuccess && onSendSuccess(data.message || "התגובה נקלטה בהצלחה", responseText.trim());
                onClose();
            } else {
                throw new Error(data.message || "שגיאה בשליחת התגובה");
            }
        } catch (err) {
            setError(err.message || "שגיאה בשליחת התגובה");
            onSendError && onSendError(err.message || "שגיאה בשליחת התגובה");
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
                disabled={sending}
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
