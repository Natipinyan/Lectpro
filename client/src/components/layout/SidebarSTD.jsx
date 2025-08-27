import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/layuot/sideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faSignInAlt, faUser, faPlusCircle, faFolderOpen, faUpload } from '@fortawesome/free-solid-svg-icons';
import NotificationPopup from "../projects/NotificationPopup";
import axios from "axios";

function SidebarSTD(props) {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState(null);
    const [department, setDepartment] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/apiStudent/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setPopupMessage({ message: "התנתקת בהצלחה", type: "success" });
                setTimeout(() => {
                    navigate('/students');
                }, 2000);
            } else {
                setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
            }
        } catch (error) {
            console.error('Logout failed:', error);
            setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
        }
    };

    useEffect(() => {
        async function fetchDepartment() {
            try {
                const res = await axios.get("http://localhost:5000/departments/std", { withCredentials: true });
                if (res.data && res.data.data) {
                    setDepartment(res.data.data);
                }
            } catch (err) {
                console.error("שגיאה בטעינת המגמה:", err);
            }
        }

        fetchDepartment();
    }, []);


    const buttons = [
        { icon: faHouse, label: 'בית', page: '/students/HomeStudent' },
        { icon: faSignInAlt, label: 'התנתקות', action: 'logout', onClick: handleLogout },
        { icon: faUser, label: 'פרופיל', page: '/students/profile' },
        { icon: faPlusCircle, label: 'הוסף פרויקט', page: '/students/upload' },
        { icon: faFolderOpen, label: 'הפרויקטים שלי', page: '/students/MyProjects' },
        { icon: faUpload, label: 'העלה קובץ', page: '/students/UpFile' },
    ];

    const handleNavigate = (page) => {
        navigate(page);
    };

    return (
        <aside className="sidebar">
            <div className="left">
                <h2>תפריט</h2>
                <div className="spacer"></div>
                <button disabled>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {department && (
                    <h2 style={{ marginTop: 'auto', textAlign: 'center',}}> {department.name}</h2>
                )}
            </div>

            <div className="right">
                <h1>lectpro</h1>
                <nav className="buttons">
                    {buttons.map((btn, index) => (
                        <button key={index} onClick={btn.onClick || (() => handleNavigate(btn.page))}>
                            <FontAwesomeIcon icon={btn.icon} />
                            <span>{btn.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {popupMessage && <NotificationPopup message={popupMessage.message} type={popupMessage.type} />}
        </aside>
    );
}

export default SidebarSTD;
