import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/base/homeStudent.css"
import logo from '../../logoMin.png'

import {
    faCheckCircle,
    faFolderOpen,
    faSignInAlt,
    faUser,
    faCogs,
    faChalkboardTeacher,
    faListAlt,
} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NotificationPopup from "../projects/NotificationPopup";

const HomeStudents = () => {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);


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

    const handleNavigate = (page) => {
        navigate(page);
    };
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
        checkAdmin();
    }, []);




    const buttons = [
        { icon: faSignInAlt, label: 'התנתקות', action: 'logout', onClick: handleLogout },
        { icon: faUser, label: 'פרופיל', page: '/instructor/profile' },
        { icon: faFolderOpen, label: 'הפרויקטים שלי', page: '/instructor/MyProjects' },
        ...(isAdmin ? [{ icon: faCheckCircle, label: 'המגמה שלי', page: '/instructor/department-instructors' }] : []),
        ...(isAdmin ? [{ icon: faCogs, label: 'ניהול טכנולוגיות', page: '/instructor/AdminTechnologies' }] : []),
        ...(isAdmin ? [{ icon: faChalkboardTeacher, label: 'קישור פרויקטים', page: '/instructor/projectManagement' }] : []),
        ...(isAdmin ? [{ icon: faListAlt, label: 'ניהול שלבים', page: '/instructor/Stages' }] : []),
    ];




    return (
        <div className="main-section-home">
            <img src={logo} alt="Logo" className="home-logo" />
            <nav className="buttons-home">
                <div className="button-row-home">
                    {buttons.slice(0, 2).map((btn, index) => (
                        <button key={index}  className="home-button" onClick={btn.onClick || (() => handleNavigate(btn.page))}>
                            <FontAwesomeIcon icon={btn.icon} />
                            <span>{btn.label}</span>
                        </button>
                    ))}
                </div>
                <div className="button-row-home">
                    {buttons.slice(2).map((btn, index) => (
                        <button key={index + 2}  className="home-button" onClick={btn.onClick || (() => handleNavigate(btn.page))}>
                            <FontAwesomeIcon icon={btn.icon} />
                            <span>{btn.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
            {popupMessage && <NotificationPopup message={popupMessage.message} type={popupMessage.type} />}
        </div>



    );
};

export default HomeStudents;