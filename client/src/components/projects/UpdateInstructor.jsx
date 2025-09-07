import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../css/projects/AssignInstructor.module.css";
import NotificationPopup from "./NotificationPopup";

const UpdateInstructor = ({ projectId, instructorId, onClose, onUpdated }) => {
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentInstructor, setCurrentInstructor] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/admin/insByDep`,
                    { withCredentials: true }
                );
                const instructorsData = response.data.data || [];
                setInstructors(instructorsData);

                const curr = instructorsData.find((ins) => ins.id === instructorId);
                setCurrentInstructor(curr || null);
            } catch (err) {
                console.error("שגיאה בטעינת מרצים:", err);
                setNotification({ message: "שגיאה בטעינת מרצים", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchInstructors();
    }, [instructorId]);

    const handleUpdate = async () => {
        if (!selectedInstructor) {
            setNotification({ message: "אנא בחר מרצה חדש לפני השמירה.", type: "error" });
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/admin/assignProjectInstructor`,
                { projectId, instructorId: selectedInstructor.id },
                { withCredentials: true }
            );

            if (response.data.success) {
                setNotification({ message: "המרצה עודכן בהצלחה!", type: "success" });
                if (onUpdated) await onUpdated();

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setNotification({ message: response.data.message || "שגיאה בעדכון המרצה.", type: "error" });
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            setNotification({ message: "שגיאת רשת בעדכון המרצה.", type: "error" });
        }
    };

    return (
        <div className={styles["update-wrapper"]}>
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <h2 className={styles["formLabel"]}>עדכון מרצה</h2>
            <div className={styles["current-instructor"]}>
                <strong>מרצה נוכחי:</strong>{" "}
                <div>
                    {currentInstructor
                        ? `${currentInstructor.first_name} ${currentInstructor.last_name}`
                        : "בטיפול"}
                </div>
                <div>
                    <strong>בחר מרצה חדש:</strong>
                </div>
            </div>

            {loading ? (
                <div className={styles["loading"]}>טוען מרצים...</div>
            ) : (
                <div className={styles["items-container"]}>
                    {instructors
                        .filter((ins) => ins.id !== currentInstructor?.id)
                        .map((ins) => (
                            <div
                                key={ins.id}
                                className={`${styles["item"]} ${
                                    selectedInstructor?.id === ins.id ? styles["selected"] : ""
                                }`}
                                onClick={() => setSelectedInstructor(ins)}
                            >
                                <div className={styles["item-text"]}>
                                    {ins.first_name} {ins.last_name}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            <div className="popup-buttons">
                <button onClick={handleUpdate} className="save-btn">
                    שמור
                </button>
                <button onClick={onClose} className="cancel-btn">
                    ביטול
                </button>
            </div>
        </div>
    );
};

export default UpdateInstructor;
