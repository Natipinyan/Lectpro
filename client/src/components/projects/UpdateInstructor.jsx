import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../css/projects/AssignInstructor.module.css";

const UpdateInstructor = ({ projectId, instructorId, onClose, onUpdated }) => {
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentInstructor, setCurrentInstructor] = useState(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/admin/insByDep`,
                    { withCredentials: true }
                );
                console.log(response);
                const instructorsData = response.data.data || [];
                setInstructors(instructorsData);
                console.log(instructorsData);

                const curr = instructorsData.find((ins) => ins.id === instructorId);
                setCurrentInstructor(curr || null);
            } catch (err) {
                console.error("שגיאה בטעינת מרצים:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, [instructorId]);

    const handleUpdate = async () => {
        if (!selectedInstructor) {
            alert("אנא בחר מרצה חדש לפני השמירה.");
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/admin/assignProjectInstructor`,
                {
                    projectId,
                    instructorId: selectedInstructor.id,
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                if (onUpdated) await onUpdated();
                onClose();
            } else {
                alert(response.data.message || "שגיאה בעדכון המרצה.");
            }
        } catch (err) {
            console.error("שגיאת רשת:", err);
            alert("שגיאת רשת בעדכון המרצה.");
        }
    };

    return (
        <div className={styles["update-wrapper"]}>
            <h2 className={styles["formLabel"]}>עדכון מרצה</h2>
            <div className={styles["current-instructor"]}>
                <strong>מרצה נוכחי:</strong>{" "}
                <div>
                    {currentInstructor
                        ? `${currentInstructor.first_name} ${currentInstructor.last_name}`
                        : "לא משויך"}
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
