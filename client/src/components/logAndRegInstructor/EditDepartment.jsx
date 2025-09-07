import React, { useState } from "react";
import NotificationPopup from "../projects/NotificationPopup";
import "../../css/logAndReg/EditDepartment.css";

const EditDepartment = ({ currentName, currentID, onClose, onSave }) => {
    const [name, setName] = useState(currentName);
    const [notification, setNotification] = useState(null);

    const handleSave = async () => {
        if (!name.trim()) {
            setNotification({ message: "שם המגמה לא יכול להיות ריק", type: "error" });
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/departments/update`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newName: name, currentID })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setNotification({ message: data.message || "שגיאה בעדכון שם המגמה", type: "error" });
                return;
            }

            setNotification({ message: "שם המגמה עודכן בהצלחה", type: "success" });
            onSave(name);
            setTimeout(onClose, 1000);
        } catch (err) {
            console.error(err);
            setNotification({ message: "שגיאה בעדכון שם המגמה", type: "error" });
        }
    };

    return (
        <div className="edit-department-container">
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h3 className="edit-department-title">עריכת שם המגמה</h3>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הזן שם חדש"
                className="edit-department-input"
            />
            <button className="edit-department-save-button" onClick={handleSave}>
                שמור
            </button>
        </div>
    );
};

export default EditDepartment;
