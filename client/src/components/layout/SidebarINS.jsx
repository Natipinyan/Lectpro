import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/layuot/sideBar.css';
import logo from '../../logoMin.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faSignInAlt, faUser, faFolderOpen, faCheckCircle, faCogs, faChalkboardTeacher, faListAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import NotificationsDropdown from "../base/NotificationsDropdown";
import NotificationPopup from "../projects/NotificationPopup";
import Modal from "../base/Modal";
import axios from "axios";

function SidebarINS() {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [department, setDepartment] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsAdmin(data.isAdmin);
                } else setIsAdmin(false);
            } catch { setIsAdmin(false); }
        };

        const fetchDepartment = async () => {
            try {
                const res = await axios.get("http://localhost:5000/departments/", { withCredentials: true });
                if (res.data && res.data.data) setDepartment(res.data.data);
            } catch (err) {
                console.error("שגיאה בטעינת המגמה:", err);
            }
        }

        checkAdmin();
        fetchDepartment();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setPopupMessage({ message: "התנתקת בהצלחה", type: "success" });
                setTimeout(() => navigate('/instructor'), 2000);
            } else setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
        } catch { setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" }); }
    };


    const buttons = [
        { icon: faHouse, label: 'בית', page: '/instructor/HomeInstructor' },
        { icon: faSignInAlt, label: 'התנתקות', onClick: handleLogout },
        { icon: faUser, label: 'פרופיל', page: '/instructor/profile' },
        { icon: faFolderOpen, label: 'הפרויקטים שלי', page: '/instructor/MyProjects' },
        ...(isAdmin ? [{ icon: faCheckCircle, label: 'המגמה שלי', page: '/instructor/department-instructors' }] : []),
        ...(isAdmin ? [{ icon: faCogs, label: 'ניהול טכנולוגיות', page: '/instructor/AdminTechnologies' }] : []),
        ...(isAdmin ? [{ icon: faChalkboardTeacher, label: 'קישור פרויקטים', page: '/instructor/projectManagement' }] : []),
        ...(isAdmin ? [{ icon: faListAlt, label: 'ניהול שלבים', page: '/instructor/Stages' }] : []),
    ];

    const handleNavigate = (page) => navigate(page);

    return (
        <aside className="sidebar">
            <div className="left">
                <h2>תפריט</h2>
                <div className="spacer"></div>
                <button disabled>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {department && <h2 style={{ marginTop: 'auto', textAlign: 'center' }}>{department.name}</h2>}
                <img src={logo} alt="Logo" className="side-logo-min" />
            </div>

            <div className="right">
                <img src={logo} alt="Logo" className="side-logo" />

                <nav className="buttons">
                    {buttons.map((btn, idx) => (
                        <button key={idx} onClick={btn.onClick || (() => handleNavigate(btn.page))}>
                            <FontAwesomeIcon icon={btn.icon} />
                            <span>{btn.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="notifications-section">
                    <button className="notifications-button"  onClick={() => setShowNotifications(true)}>
                        <FontAwesomeIcon icon={faBell} />
                        <span>התראות</span>
                    </button>
                </div>
            </div>

            {showNotifications && (
                <Modal onClose={() => setShowNotifications(false)} width="40vw">
                    <NotificationsDropdown
                        onClose={() => setShowNotifications(false)}
                    />
                </Modal>
            )}

            {popupMessage && <NotificationPopup message={popupMessage.message} type={popupMessage.type} />}
        </aside>
    );
}

export default SidebarINS;