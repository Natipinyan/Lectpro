import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../base/Modal";
import EditStageForm from "./EditStageForm";
import AddStageForm from "./AddStageForm";
import NotificationPopup from "./NotificationPopup";
import '../../css/projects/StagesManager.css';

const StagesManager = () => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStage, setEditingStage] = useState(null);
    const [addingStage, setAddingStage] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchStages();
    }, []);

    const fetchStages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stages`, { credentials: "include" });
            const data = await response.json();
            if (response.ok && data.success) {
                const sortedStages = data.data.sort((a, b) => a.position - b.position);
                setStages(sortedStages);
            } else {
                setError(data.message || "שגיאה בטעינת השלבים");
            }
        } catch (err) {
            setError("שגיאה בטעינת השלבים");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "האם אתה בטוח?",
            text: "לא תוכל לשחזר את זה!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "כן, מחק!",
            cancelButtonText: "ביטול",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stages/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        fetchStages();
                        setNotification({ message: data.message, type: "success" });
                    } else {
                        setNotification({ message: data.message || "שגיאה במחיקה", type: "error" });
                    }
                } catch (err) {
                    setNotification({ message: "שגיאה בשרת", type: "error" });
                }
            }
        });
    };

    const handleEdit = (stage) => setEditingStage(stage);
    const handleCloseModal = () => {
        setEditingStage(null);
        setAddingStage(false);
    };
    const handleCloseNotification = () => setNotification(null);

    if (loading) return <div>טוען נתונים...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="stages-container">
            <div className="stages-header">
                <h2 className="stages-title">רשימת שלבים</h2>
                <button className="btn-add-stage" onClick={() => setAddingStage(true)}>
                    ➕ הוסף שלב חדש
                </button>
            </div>

            {stages.length === 0 ? (
                <p>לא נמצאו שלבים</p>
            ) : (
                <table className="stages-table">
                    <thead>
                    <tr>
                        <th>מספר שלב</th>
                        <th>שם שלב</th>
                        <th>עריכה</th>
                        <th>מחיקה</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stages.map((stage, index) => (
                        <tr key={stage.id}>
                            <td>{index + 1}</td>
                            <td>{stage.title}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(stage)}>✏️ עריכה</button>
                            </td>
                            <td>
                                <button className="btn-delete" onClick={() => handleDelete(stage.id)}>🗑️ מחיקה</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {editingStage && (
                <Modal onClose={handleCloseModal} width="40vw">
                    <EditStageForm
                        stage={editingStage}
                        stages={stages}
                        onClose={handleCloseModal}
                        onSave={() => {
                            fetchStages();
                            setNotification({ message: "השלב עודכן בהצלחה", type: "success" });
                        }}
                    />
                </Modal>
            )}

            {addingStage && (
                <Modal onClose={handleCloseModal} width="40vw">
                    <AddStageForm
                        stages={stages}
                        onClose={handleCloseModal}
                        onSave={() => {
                            fetchStages();
                            setNotification({ message: "השלב נוסף בהצלחה", type: "success" });
                        }}
                    />
                </Modal>
            )}

            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default StagesManager;
