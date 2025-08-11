import React from "react";
import "../../css/projects/CommentsProject.css";

const CommentsProject = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return <div>אין הערות לפרויקט זה</div>;
    }

    return (
        <div className="comments-container">
            <h3>הערות לפרויקט</h3>
            {comments.map(({ id, title, page, section, is_done, user_marked }) => (
                <div className="comment-card" key={id}>
                    <div className="comment-header">
                        <div className="comment-title">{title}</div>
                        <div className="comment-details">
                            <span>סעיף הערה: {section}</span>
                            <span>עמוד הערה: {page}</span>
                            <span>סטודנט סימן כבוצע: {user_marked || "ממתין לתגובת הסטודנט"}</span>
                            <span className={`comment-status ${is_done ? "done" : "not-done"}`}>
                                הערה בוצעה: {is_done ? "הושלם" : "לא הושלם"}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentsProject;