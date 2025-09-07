import React, { useEffect, useState } from "react";
import '../../css/projects/AddStudentToProject.css';
import NotificationPopup from "./NotificationPopup";

function AddStudentToProject({ projectId , onClose ,studentId ,onUpdated}) {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "" });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/admin/stdByDep", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success) {
                    setStudents(data.data);
                } else {
                    setNotification({ message: "שגיאה בטעינת הסטודנטים", type: "error" });
                }
            } catch (err) {
                setNotification({ message: "שגיאה בשרת", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = async () => {
        if (!selectedStudent) return setNotification({ message: "בחר סטודנט להוספה", type: "error" });

        try {
            const res = await fetch(`/admin/${projectId}/addStudent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: selectedStudent }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setNotification({ message: "סטודנט נוסף בהצלחה", type: "success" });
                if (onUpdated) await onUpdated();

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setNotification({ message: data.message || "שגיאה בהוספת הסטודנט", type: "error" });
            }
        } catch (err) {
            setNotification({ message: "שגיאה בשרת", type: "error" });
        }
    };

    return (
        <div className="add-student-container">
            {loading ? (
                <p>טוען סטודנטים...</p>
            ) : (
                <>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="student-select"
                    >
                        <option value="">בחר סטודנט</option>
                        {students
                            .filter((student) => student.id !== studentId)
                            .map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.first_name} {student.last_name}
                                </option>
                            ))}
                    </select>
                    <button onClick={handleAddStudent} className="save-btn">
                        שמור
                    </button>
                </>
            )}


            {notification.message && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "" })}
                />
            )}
        </div>
    );
}

export default AddStudentToProject;
