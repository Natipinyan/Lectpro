import React, { useEffect, useState } from "react";
import NotificationPopup from "../projects/NotificationPopup";

const DepartmentInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const adminCheckRes = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/`, {
                    method: "GET",
                    credentials: "include",
                });
                const adminData = await adminCheckRes.json();

                if (!adminCheckRes.ok || !adminData.isAdmin) {
                    setError("אתה לא מנהל");
                    return;
                }

                const instructorsRes = await fetch(`${process.env.REACT_APP_BASE_URL}/instructor/register/insByDep`, {
                    method: "GET",
                    credentials: "include",
                });
                const instructorsData = await instructorsRes.json();
                console.log(instructorsData);

                if (instructorsRes.ok) {
                    setInstructors(instructorsData.data);
                } else {
                    setError(instructorsData.message || "שגיאה בטעינת המרצים");
                }

            } catch (err) {
                console.error(err);
                setError("שגיאה בטעינת המרצים");
            }
        };

        fetchInstructors();
    }, []);

    if (error) {
        return <NotificationPopup message={error} type="error" />;
    }

    return (
        <div>
            <h2>מרצים במגמה שלך</h2>
            <ul>
                {instructors.map((ins) => (
                    <li key={ins.id}>{ins.first_name} {ins.last_name} ({ins.user_name})</li>
                ))}
            </ul>
        </div>
    );
};

export default DepartmentInstructors;
