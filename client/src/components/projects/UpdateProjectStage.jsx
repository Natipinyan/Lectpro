import React, { useState, useEffect } from "react";
import NotificationPopup from "../projects/NotificationPopup";
import axios from "axios";

const UpdateProjectStage = ({ projectId, onClose, onUpdate }) => {
    const [stages, setStages] = useState([]);
    const [currentStage, setCurrentStage] = useState(null);
    const [selectedStage, setSelectedStage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);



    useEffect(() => {
        const fetchProjectStages = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/stages/projectStages/${projectId}`,
                    { withCredentials: true }
                );

                if (res.data && res.data.success) {
                    setStages(res.data.data.allStages);
                    setCurrentStage(res.data.data.currentStage);
                    setSelectedStage(res.data.data.currentStage?.position || "");
                } else {
                    setError(res.data.message || "שגיאה בטעינת השלבים");
                }
            } catch (err) {
                console.error(err);
                setError("שגיאה בטעינת השלבים");
            } finally {
                setLoading(false);
            }
        };
        fetchProjectStages();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStage) return;

        try {
            const res = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/stages/updateProjectStage/${projectId}`,
                { stage: selectedStage },
                { withCredentials: true }
            );

            if (res.data.success) {
                setNotification({ message: "שלב הפרויקט עודכן בהצלחה!", type: "success" });
                onUpdate?.();
                setTimeout(() => {
                    onClose();
                    setNotification(null);
                }, 1500);
            }
        } catch (err) {

            const message = err.response?.data?.message || "שגיאה בעדכון השלב";
            setNotification({ message, type: "error" });
        }
    };

    if (loading) return <div>טוען את השלבים...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <form onSubmit={handleSubmit}>
                <h3>עדכון שלב נוכחי של הפרויקט</h3>
                <label>בחר שלב:</label>
                <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(parseInt(e.target.value))}
                >
                    <option value="">-- בחר שלב --</option>
                    {stages.map((s) => (
                        <option key={s.id} value={s.position}>
                            {s.title} {s.position === currentStage?.position ? "(נוכחי)" : ""}
                        </option>
                    ))}
                </select>
                <div  className="popup-buttons" >
                    <button type="submit" className="save-btn" >עדכן</button>
                    <button type="button" className="cancel-btn" onClick={onClose}>ביטול</button>
                </div>
            </form>
        </>
    );
};

export default UpdateProjectStage;
