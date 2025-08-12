import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/projects/CommentsProject.css";

const CommentsProject = ({ comments ,nav}) => {
    const [activeTab, setActiveTab] = useState("all");
    const  navUrl = nav;
    const navigate = useNavigate();

    if (
        !comments ||
        (!comments.notDone?.length &&
            !comments.doneAndCompleted?.length &&
            !comments.doneButNotCompleted?.length)
    ) {
        return <div>אין הערות לפרויקט זה</div>;
    }

    const all = [
        ...(comments.notDone || []),
        ...(comments.doneAndCompleted || []),
        ...(comments.doneButNotCompleted || []),
    ];

    const notDone = comments.notDone || [];
    const doneButNotCompleted = comments.doneButNotCompleted || [];
    const doneAndCompleted = comments.doneAndCompleted || [];

    let displayedComments = [];
    switch (activeTab) {
        case "all":
            displayedComments = all;
            break;
        case "notDone":
            displayedComments = notDone;
            break;
        case "doneButNotCompleted":
            displayedComments = doneButNotCompleted;
            break;
        case "doneAndCompleted":
            displayedComments = doneAndCompleted;
            break;
        default:
            displayedComments = all;
    }

    return (
        <div className="comments-container">
            <h3>הערות לפרויקט</h3>

            <div className="tabs">
                <button
                    className={activeTab === "all" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("all")}
                >
                    כל ההערות ({all.length})
                </button>
                <button
                    className={activeTab === "notDone" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("notDone")}
                >
                    ממתין לתגובת סטודנט ({notDone.length})
                </button>
                <button
                    className={activeTab === "doneButNotCompleted" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("doneButNotCompleted")}
                >
                    ממתין לתגובת מרצה ({doneButNotCompleted.length})
                </button>
                <button
                    className={activeTab === "doneAndCompleted" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("doneAndCompleted")}
                >
                    הושלם ({doneAndCompleted.length})
                </button>
            </div>

            <div
                className="comments-grid-header"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr" }}
            >
                <span>כותרת הערה</span>
                <span>סעיף הערה</span>
                <span>עמוד הערה</span>
                <span>בוצע תיקון</span>
                <span>סטטוס הערה</span>
                <span>מעבר להערה</span>
            </div>

            {displayedComments.length === 0 ? (
                <div className="no-comments-message">אין הערות להצגה בטאב זה.</div>
            ) : (
                displayedComments.map(
                    ({ id, title, text, page, section, is_done, done_by_user, user_response }) => (
                        <div
                            className="comment-row"
                            key={id}
                            style={{ gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr" }}
                        >
                            <span>{title}</span>
                            <span>{section}</span>
                            <span>{page}</span>
                            <span>
                                {done_by_user
                                    ? "סטודנט סימן כבוצע"
                                    : user_response || "ממתין לתגובת הסטודנט"}
                            </span>
                            <span className={`comment-status ${is_done ? "done" : "not-done"}`}>
                                {is_done ? "הושלם" : "לא הושלם"}
                            </span>
                            <span>
                                <button
                                    onClick={() => {
                                        navigate(`/${navUrl}/comments/${id}`, {
                                            state: {
                                                comment: {
                                                    id,
                                                    title,
                                                    page,
                                                    section,
                                                    text,
                                                    is_done,
                                                    done_by_user,
                                                    user_response
                                                }
                                            }
                                        });
                                    }}
                                    className="go-to-comment-button"
                                >
                                    מעבר להערה
                                </button>
                            </span>
                        </div>
                    )
                )
            )}
        </div>
    );
};

export default CommentsProject;
