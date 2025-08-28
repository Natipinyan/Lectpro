import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/layuot/sideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faSignInAlt, faUser, faFolderOpen,faCheckCircle, faCogs} from '@fortawesome/free-solid-svg-icons';
import NotificationPopup from "../projects/NotificationPopup";
import axios from "axios";

function SidebarINS(props) {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [department, setDepartment] = useState(null);


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
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            }
        };
        const department  = async function fetchDepartment() {
            try {
                const res = await axios.get("http://localhost:5000/departments/", { withCredentials: true });
                if (res.data && res.data.data) {
                    setDepartment(res.data.data);
                }
            } catch (err) {
                console.error("שגיאה בטעינת המגמה:", err);
            }
        }
        checkAdmin();
        department();
    }, []);


    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setPopupMessage({ message: "התנתקת בהצלחה", type: "success" });
                setTimeout(() => {
                    navigate('/instructor');
                }, 2000);
            } else {
                setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
            }
        } catch (error) {
            setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
        }
    };

    const buttons = [
        { icon: faHouse, label: 'בית', page: '/instructor/HomeInstructor' },
        { icon: faSignInAlt, label: 'התנתקות', action: 'logout', onClick: handleLogout },
        { icon: faUser, label: 'פרופיל', page: '/instructor/profile' },
        { icon: faFolderOpen, label: 'הפרויקטים שלי', page: '/instructor/MyProjects' },
        ...(isAdmin ? [{ icon: faCheckCircle, label: 'המגמה שלי', page: '/instructor/department-instructors' }] : []),
        ...(isAdmin ? [{ icon: faCogs, label: 'ניהול טכנולוגיות', page: '/instructor/AdminTechnologies' }] : []),
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

export default SidebarINS;