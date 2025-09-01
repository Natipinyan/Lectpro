import React, { useEffect, useState } from "react";
import NotificationPopup from "../projects/NotificationPopup";
import Modal from "../base/Modal";
import EditDepartment from "./EditDepartment";
import "../../css/logAndReg/DepartmentInstructors.css";

const DepartmentInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [departmentID, setDepartmentID] = useState("");
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const adminRes = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/`, {
                method: "GET",
                credentials: "include",
            });
            const adminData = await adminRes.json();

            if (!adminRes.ok || !adminData.isAdmin) {
                setNotification({ message: "אתה לא מנהל", type: "error" });
                return;
            }

            const instructorsRes = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/insByDep`, {
                method: "GET",
                credentials: "include",
            });
            const instructorsData = await instructorsRes.json();
            if (!instructorsRes.ok) {
                setNotification({ message: instructorsData.message || "שגיאה בטעינת המרצים", type: "error" });
                return;
            }
            setInstructors(instructorsData.data);

            const studentsRes = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/stdByDep`, {
                method: "GET",
                credentials: "include",
            });
            const studentsData = await studentsRes.json();
            if (!studentsRes.ok) {
                setNotification({ message: studentsData.message || "שגיאה בטעינת הסטודנטים", type: "error" });
                return;
            }
            setStudents(studentsData.data);

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
            setNotification({ message: "שגיאה בטעינת הנתונים", type: "error" });
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/toggle-status/${id}`, {
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
            fetchData();
        } catch (err) {
            console.error(err);
            setNotification({ message: "שגיאה בשינוי הסטטוס", type: "error" });
        }
    };

    const activeInstructors = instructors.filter(ins => ins.is_active);
    const inactiveInstructors = instructors.filter(ins => !ins.is_active);

    const renderTable = (list, isActiveTable, type = "instructor") => (
        <div className="comments-containerA">
            <h3>
                {type === "instructor"
                    ? isActiveTable ? "מרצים פעילים" : "מרצים לא פעילים"
                    : "סטודנטים במגמה"}
            </h3>
            <div className="comments-grid-header">
                <span>שם פרטי</span>
                <span>שם משפחה</span>
                <span>שם משתמש</span>
                <span>אימייל</span>
                <span>טלפון</span>
                {type === "instructor" && <span>סטטוס</span>}
                {type === "instructor" && <span>שנה סטטוס</span>}
            </div>
            {list.length === 0 ? (
                <p className="no-comments-message">אין {type === "instructor" ? "מרצים" : "סטודנטים"} להצגה</p>
            ) : (
                list.map(item => (
                    <div key={item.id} className="comment-row">
                        <span>{item.first_name}</span>
                        <span>{item.last_name}</span>
                        <span>{item.user_name}</span>
                        <span>{item.email}</span>
                        <span>{item.phone}</span>
                        {type === "instructor" && (
                            <>
                                <span className={`comment-status ${item.is_active ? "done" : "not-done"}`}>
                                    {item.is_active ? "פעיל" : "לא פעיל"}
                                </span>
                                <button className="go-to-comment-button" onClick={() => toggleStatus(item.id)}>
                                    {item.is_active ? "הפוך ללא פעיל" : "הפוך לפעיל"}
                                </button>
                            </>
                        )}
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
            {renderTable(students, null, "student")}

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
