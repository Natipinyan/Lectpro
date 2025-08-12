import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/projects/InstructorComment.css";
import Modal from "../base/Modal";
import MarkDoneResponse from "../projects/ MarkDoneResponse"
import NotificationPopup from "./NotificationPopup";

const InstructorComment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { comment } = location.state || {};

    const [currentComment, setCurrentComment] = useState(comment);

    const [notification, setNotification] = useState(null);

    const [showMarkDoneModal, setShowMarkDoneModal] = useState(false);

    const handleSendMarkDone = async (responseText) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/comments/isDone/${currentComment.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_response: responseText }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "שגיאה בסימון ההערה כבוצעה");
            }

            setCurrentComment(prev => ({
                ...prev,
                is_done: true,
                user_response: responseText,
            }));

            setNotification({ message: "ההערה סומנה כבוצעה בהצלחה!", type: "success" });
            setShowMarkDoneModal(false);
        } catch (error) {
            throw error;
        }
    };


    if (!currentComment) {
        return <div className="no-comment">לא נמצאה הערה</div>;
    }

    return (
        <div className="comment-page">
            <div className="top-boxes">
                <div className="info-box">
                    <span className="label">כותרת הערה</span>
                    <span className="value">{currentComment.title}</span>
                </div>
                <div className="info-box">
                    <span className="label">סעיף הערה</span>
                    <span className="value">{currentComment.section}</span>
                </div>
                <div className="info-box">
                    <span className="label">עמוד הערה במסמך</span>
                    <span className="value">{currentComment.page}</span>
                </div>
            </div>

            <div className="bottom-card">
                <div className="top-buttons">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                        aria-label="חזרה לכל ההערות"
                    >
                        ✖ סגור הערה
                    </button>
                </div>

                <div className="comment-content">
                    <span className="label">תוכן ההערה</span>
                    <p className="value">{currentComment.text || "אין תוכן להצגה"}</p>
                </div>

                <div className="status-boxes">
                    <div className="status-box">
                        <span className="label">האם הושלם על ידי המשתמש?</span>
                        <span className="value">
              {currentComment.done_by_user ? "כן" : "לא"}
            </span>
                    </div>

                    <div className="status-box">
                        <span className="label">סטטוס הערה</span>
                        <span
                            className={`value ${
                                currentComment.is_done ? "done-user" : "not-done-user"
                            }`}
                        >
              {currentComment.is_done ? "הושלם" : "לא הושלם"}
            </span>
                    </div>
                </div>

                {currentComment.done_by_user &&
                    String(currentComment.user_response).trim() !== "" && (
                        <div className="user-response">
                            <span className="label">תגובת המשתמש:</span>
                            <p>{currentComment.user_response}</p>
                        </div>
                    )}

                <div
                    style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
                >
                    <button
                        className="mark-button"
                        style={{ width: "200px" }}
                        onClick={() => setShowMarkDoneModal(true)}
                        disabled={currentComment.is_done}
                    >
                        {currentComment.is_done ? "ההערה כבר סומנה" : "סמן כבוצע"}
                    </button>
                </div>
            </div>

            {showMarkDoneModal && (
                <Modal onClose={() => setShowMarkDoneModal(false)} width="40vw">
                    <MarkDoneResponse
                        onClose={() => setShowMarkDoneModal(false)}
                        onSend={handleSendMarkDone}
                    />
                </Modal>
            )}

            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default InstructorComment;
