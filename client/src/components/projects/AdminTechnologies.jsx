import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../base/Modal";
import EditTechnologyForm from "./EditTechnologyForm";
import AddTechnology from "./AddTech";
import NotificationPopup from "./NotificationPopup";
import '../../css/projects/AdminTechnologies.css';

const AdminTechnologies = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTech, setEditingTech] = useState(null);
    const [addingTech, setAddingTech] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const fetchTechnologies = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/technology/getAdmin`,
                { method: "GET", credentials: "include" }
            );
            const data = await response.json();
            if (response.ok && data.success) {
                setTechnologies(data.data);
            } else {
                setError(data.message || "שגיאה בטעינת הטכנולוגיות");
            }
        } catch (err) {
            setError("שגיאה בטעינת הטכנולוגיות");
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
                    const response = await fetch(
                        `${process.env.REACT_APP_BASE_URL}/technology/${id}`,
                        { method: "DELETE", credentials: "include" }
                    );
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setTechnologies((prev) => prev.filter((tech) => tech.id !== id));
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

    const handleEdit = (tech) => setEditingTech(tech);
    const handleCloseModal = () => {
        setEditingTech(null);
        setAddingTech(false);
    };
    const handleCloseNotification = () => setNotification(null);

    if (loading) return <div>טוען נתונים...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="admin-tech-container">
            <div className="admin-tech-header">
                <h2 className="admin-tech-title">רשימת טכנולוגיות</h2>
                <button
                    className="btn-add-tech"
                    onClick={() => setAddingTech(true)}
                >
                    ➕ הוסף טכנולוגיה חדשה
                </button>
            </div>

            {technologies.length === 0 ? (
                <p>לא נמצאו טכנולוגיות</p>
            ) : (
                <table className="admin-tech-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>סוג טכנולוגיה</th>
                        <th>שפת טכנולוגיה</th>
                        <th>עריכה</th>
                        <th>מחיקה</th>
                    </tr>
                    </thead>
                    <tbody>
                    {technologies.map((tech, index) => (
                        <tr key={tech.id}>
                            <td>{index + 1}</td>
                            <td>{tech.title}</td>
                            <td>{tech.language}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(tech)}>✏️ עריכה</button>
                            </td>
                            <td>
                                <button className="btn-delete" onClick={() => handleDelete(tech.id)}>🗑️ מחיקה</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            )}

            {editingTech && (
                <Modal onClose={handleCloseModal} width="40vw">
                    <EditTechnologyForm
                        tech={editingTech}
                        onClose={handleCloseModal}
                        onSave={() => {
                            fetchTechnologies();
                            setNotification({ message: "הטכנולוגיה עודכנה בהצלחה", type: "success" });
                        }}
                    />
                </Modal>
            )}

            {addingTech && (
                <Modal onClose={handleCloseModal} width="40vw">
                    <AddTechnology
                        onBackToProject={handleCloseModal}
                        showNotification={(msg, type) => setNotification({ message: msg, type })}
                        onSave={() => {
                            fetchTechnologies();
                            setNotification({ message: "הטכנולוגיה נוספה בהצלחה", type: "success" });
                            handleCloseModal();
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

export default AdminTechnologies;
