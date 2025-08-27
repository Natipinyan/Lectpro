import React, { useEffect, useState } from "react";
import NotificationPopup from "../projects/NotificationPopup";
import Modal from "../base/Modal";
import EditDepartment from "./EditDepartment";
import "../../css/logAndReg/DepartmentInstructors.css";

const DepartmentInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [departmentID, setDepartmentID] = useState("");
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const adminCheckRes = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/`, {
                method: "GET",
                credentials: "include",
            });
            const adminData = await adminCheckRes.json();

            if (!adminCheckRes.ok || !adminData.isAdmin) {
                setNotification({ message: "אתה לא מנהל", type: "error" });
                return;
            }

            const instructorsRes = await fetch(`${process.env.REACT_APP_BASE_URL}/instructor/register/insByDep`, {
                method: "GET",
                credentials: "include",
            });
            const instructorsData = await instructorsRes.json();
            if (!instructorsRes.ok) {
                setNotification({ message: instructorsData.message || "שגיאה בטעינת המרצים", type: "error" });
                return;
            }
            setInstructors(instructorsData.data);

            const departmentRes = await fetch(`${process.env.REACT_APP_BASE_URL}/departments/`, {
                method: "GET",
                credentials: "include",
            });
            const departmentData = await departmentRes.json();

            if (departmentRes.ok && departmentData.success) {
                setDepartmentName(departmentData.data.name);
                setDepartmentID(departmentData.data.id);
            } else {
                setDepartmentName("מגמה לא ידועה");
                setDepartmentID("");
            }

        } catch (err) {
            console.error(err);
            setNotification({ message: "שגיאה בטעינת המרצים", type: "error" });
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/instructor/register/toggle-status/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setNotification({ message: data.message || "שגיאה בשינוי הסטטוס", type: "error" });
                return;
            }
            setNotification({ message: data.message, type: "success" });
            fetchInstructors();
        } catch (err) {
            console.error(err);
            setNotification({ message: "שגיאה בשינוי הסטטוס", type: "error" });
        }
    };

    const activeInstructors = instructors.filter(ins => ins.is_active);
    const inactiveInstructors = instructors.filter(ins => !ins.is_active);

    const renderTable = (list, isActiveTable) => (
        <div className="comments-containerA">
            <h3>{isActiveTable ? "מרצים פעילים" : "מרצים לא פעילים"}</h3>
            <div className="comments-grid-header">
                <span>שם פרטי</span>
                <span>שם משפחה</span>
                <span>שם משתמש</span>
                <span>אימייל</span>
                <span>טלפון</span>
                <span>סטטוס</span>
                <span>פעולה</span>
            </div>
            {list.length === 0 ? (
                <p className="no-comments-message">אין מרצים להצגה</p>
            ) : (
                list.map(ins => (
                    <div key={ins.id} className="comment-row">
                        <span>{ins.first_name}</span>
                        <span>{ins.last_name}</span>
                        <span>{ins.user_name}</span>
                        <span>{ins.email}</span>
                        <span>{ins.phone}</span>
                        <span className={`comment-status ${ins.is_active ? "done" : "not-done"}`}>
                            {ins.is_active ? "פעיל" : "לא פעיל"}
                        </span>
                        <button className="go-to-comment-button" onClick={() => toggleStatus(ins.id)}>
                            {ins.is_active ? "הפוך ללא פעיל" : "הפוך לפעיל"}
                        </button>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="department-instructors-wrapper">
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {departmentName && (
                <div className="department-header">
                    <h2 className="department-name">{departmentName}</h2>
                    <button className="edit-department-button" onClick={() => setIsModalOpen(true)}>
                        ✎ עריכה
                    </button>
                </div>
            )}

            {renderTable(activeInstructors, true)}
            {renderTable(inactiveInstructors, false)}

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} width="30vw">
                    <EditDepartment
                        currentName={departmentName}
                        currentID={departmentID}
                        onClose={() => setIsModalOpen(false)}
                        onSave={(newName) => setDepartmentName(newName)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default DepartmentInstructors;
