import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/projects/InstructorComment.css";
import Modal from "../base/Modal";
import MarkDoneResponse from "./MarkDoneResponse";
import NotificationPopup from "./NotificationPopup";

const Comment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const commentID = location.state?.comment?.id ?? null;

    const [currentComment, setCurrentComment] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showMarkDoneModal, setShowMarkDoneModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!commentID) {
            setError("לא התקבל מזהה הערה");
            setLoading(false);
            return;
        }

        const fetchComment = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/comments/${commentID}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    setCurrentComment(data.data);
                } else {
                    setError(data.message || "אירעה שגיאה בטעינת ההערה");
                }
            } catch (err) {
                setError("אירעה שגיאה בטעינת ההערה");
            } finally {
                setLoading(false);
            }
        };

        fetchComment();
    }, [commentID]);

    const handleMarkDone = () => {
        if (!currentComment || currentComment.done_by_user) return;
        setShowMarkDoneModal(true);
    };

    const fetchNextComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/comments/next/${currentComment.id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok && data.success && data.data) {
                setCurrentComment(data.data);
                setNotification({ message: "הערה הבאה נטענה בהצלחה!", type: "success" });
            } else {
                setNotification({ message: data.message || "אין הערה הבאה", type: "info" });
            }
        } catch (err) {
            setNotification({ message: "שגיאה בטעינת ההערה הבאה", type: "error" });
        }
    };

    const fetchPrevComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/comments/prev/${currentComment.id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok && data.success && data.data) {
                setCurrentComment(data.data);
                setNotification({ message: "הערה קודמת נטענה בהצלחה!", type: "success" });
            } else {
                setNotification({ message: data.message || "אין הערה קודמת", type: "info" });
            }
        } catch (err) {
            setNotification({ message: "שגיאה בטעינת ההערה הקודמת", type: "error" });
        }
    };


    if (loading) return <div className="loading">טוען...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!currentComment) return <div className="no-comment">לא נמצאה הערה</div>;

    const markButtonText = currentComment.done_by_user
        ? "ההערה כבר סומנה כבוצעה"
        : "סמן כבוצע";

    const markButtonDisabled = currentComment.done_by_user || currentComment.is_done;

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

                    <button className="prev-button" onClick={fetchPrevComment}>
                        ← הערה קודמת
                    </button>
                    <button
                        className="back-button"
                        aria-label="חזרה לכל ההערות"
                        onClick={() => navigate(-1)}
                    >
                        ✖ סגור הערה
                    </button>
                    <button className="next-button" onClick={fetchNextComment}>
                        הערה הבאה →
                    </button>
                </div>

                <div className="comment-content">
                    <span className="label">תוכן ההערה</span>
                    <p className="value">{currentComment.text || "אין תוכן להצגה"}</p>
                </div>

                <div className="status-boxes">
                    <div className="status-box">
                        <span className="label">האם הושלם על ידי המשתמש?</span>
                        <span className={`value ${currentComment.done_by_user ? "done-by-user-true" : "done-by-user-false"}`}>
                            {currentComment.done_by_user ? "כן" : "לא"}
                        </span>
                    </div>

                    <div className="status-box">
                        <span className="label">סטטוס הערה</span>
                        <span className={`value ${currentComment.is_done ? "done-user" : "not-done-user"}`}>
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
                        onClick={handleMarkDone}
                        disabled={markButtonDisabled}
                    >
                        {markButtonText}
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
                            }));
                            setShowMarkDoneModal(false);
                        }}
                        onSendError={(msg) => setNotification({ message: msg, type: "error" })}
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
