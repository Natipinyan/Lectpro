import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/base/homeStudent.css"
import {faFolderOpen, faPlusCircle, faSignInAlt, faUpload, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NotificationPopup from "../projects/NotificationPopup";

const HomeStudents = () => {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/apiStudent/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setPopupMessage({ message: data.message || "התנתקת בהצלחה", type: "success" });
                setTimeout(() => {
                    navigate('/students');
                }, 2000);
            } else {
                setPopupMessage({ message: data.message || "שגיאה בהתנתקות", type: "error" });
            }
        } catch (error) {
            console.error('Logout failed:', error);
            setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
        }
    };

    const handleNavigate = (page) => {
        navigate(page);
    };


    const buttons = [
        { icon: faSignInAlt, label: 'התנתקות', action: 'logout', onClick: handleLogout },
        { icon: faUser, label: 'פרופיל', page: '/students/profile' },
        { icon: faPlusCircle, label: 'הוסף פרויקט', page: '/students/upload' },
        { icon: faFolderOpen, label: 'הפרויקטים שלי', page: '/students/MyProjects' },
        { icon: faUpload, label: 'העלה קובץ', page: '/students/UpFile' },
    ];



    return (
        <div className="main-section-home">
            <h1>lectpro</h1>
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