import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/projects/InstructorComment.css";
import Swal from "sweetalert2";
import Modal from "../base/Modal";
import CommentEdit from "./CommentEdit";
import NotificationPopup from "./NotificationPopup";

const InstructorComment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const commentID = location.state?.comment?.id ?? null;

    const [currentComment, setCurrentComment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

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
            console.log("Next comment data:", data);
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

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "האם אתה בטוח?",
            text: "הפעולה תמחק את ההערה לצמיתות!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "כן, מחק!",
            cancelButtonText: "ביטול",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/comments/${currentComment.id}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                if (response.ok && data.success) {
                    Swal.fire("נמחק!", "ההערה נמחקה בהצלחה.", "success");
                    navigate(-1);
                } else {
                    throw new Error(data.message || "שגיאה במחיקת ההערה");
                }
            } catch (error) {
                Swal.fire("שגיאה", error.message, "error");
            }
        }
    };

    const handleEditClick = () => setShowEdit(true);

    const handleSaveNote = (updatedComment) => {
        setCurrentComment(updatedComment);
        setShowEdit(false);
        setNotification({ message: "ההערה עודכנה בהצלחה!", type: "success" });
    };

    const handleMarkDone = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/comments/isDone/${currentComment.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();

            if (response.ok && data.success) {
                setCurrentComment((prev) => ({ ...prev, is_done: true }));
                setNotification({ message: "ההערה סומנה כבוצעה בהצלחה!", type: "success" });
            } else {
                throw new Error(data.message || "שגיאה בסימון ההערה כבוצעה");
            }
        } catch (error) {
            setNotification({ message: error.message || "שגיאה בשרת", type: "error" });
        }
    };

    if (loading) {
        return <div className="loading">טוען...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

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
                    <button className="prev-button" onClick={fetchPrevComment}>
                        ← הערה קודמת
                    </button>
                    <button className="back-button" onClick={() => navigate(-1)} aria-label="חזרה לכל ההערות">
                        ✖ סגור הערה
                    </button>
                    <button className="delete-button" onClick={handleDelete}>
                        🗑 מחק הערה
                    </button>
                    <button
                        className="edit-button"
                        onClick={handleEditClick}
                        disabled={currentComment.is_done}
                    >
                        {currentComment.is_done ? "הושלם" : "✏ ערוך הערה"}
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
                        <span className="value">
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

                {currentComment.done_by_user &&
                    String(currentComment.user_response).trim() !== "" && (
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
                        disabled={!currentComment.done_by_user || currentComment.is_done}
                    >
                        {currentComment.done_by_user
                            ? currentComment.is_done
                                ? "הושלם"
                                : "סמן כבוצע"
                            : "לא בוצע"}
                    </button>
                </div>
            </div>

            {showEdit && (
                <Modal onClose={() => setShowEdit(false)} width="40vw">
                    <CommentEdit
                        comment={currentComment}
                        onClose={() => setShowEdit(false)}
                        onSaveSuccess={handleSaveNote}
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