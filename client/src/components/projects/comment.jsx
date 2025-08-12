import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/projects/InstructorComment.css";
import Modal from "../base/Modal";
import MarkDoneResponse from "./MarkDoneResponse";
import NotificationPopup from "./NotificationPopup";

const Comment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { comment } = location.state || {};

    const [currentComment, setCurrentComment] = useState(comment);
    const [notification, setNotification] = useState(null);
    const [showMarkDoneModal, setShowMarkDoneModal] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        if (currentComment) {
            setButtonDisabled(currentComment.done_by_user || currentComment.is_done);
        }
    }, [currentComment]);

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
                        <span
                            className={`value ${
                                currentComment.done_by_user ? "done-by-user-true" : "done-by-user-false"
                            }`}
                        >
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

                {currentComment.done_by_user && currentComment.user_response?.trim() !== "" && (
                    <div className="user-response">
                        <span className="label">תגובת המשתמש:</span>
                        <p>{currentComment.user_response}</p>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <button
                        className="mark-button"
                        style={{ width: "200px" }}
                        onClick={() => setShowMarkDoneModal(true)}
                        disabled={buttonDisabled}
                    >
                        {buttonDisabled ? "ההערה כבר סומנה" : "סמן כבוצע"}
                    </button>
                </div>
            </div>

            {showMarkDoneModal && (
                <Modal onClose={() => setShowMarkDoneModal(false)} width="40vw">
                    <MarkDoneResponse
                        commentId={currentComment.id}
                        onClose={() => setShowMarkDoneModal(false)}
                        onSendSuccess={(msg, responseText) => {
                            setNotification({ message: msg, type: "success" });
                            setCurrentComment((prev) => ({
                                ...prev,
                                done_by_user: true,
                                user_response: responseText,
                                is_done: true,
                            }));
                            setButtonDisabled(true);
                            setShowMarkDoneModal(false);

                            setTimeout(() => {
                                navigate(-1);
                            }, 3000);
                        }}
                        onSendError={(msg) => {
                            setNotification({ message: msg, type: "error" });
                        }}
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

export default Comment;